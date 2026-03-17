import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  Timestamp,
  getDocFromServer,
  doc,
  updateDoc,
  increment,
  setDoc,
  deleteDoc,
  getDocs,
  where
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { analyzeScamReport } from '../services/aiService';

export interface Report {
  id: string;
  companyName: string;
  role: string;
  description: string;
  scamType: 'fake-job' | 'fee-scam' | 'phishing' | 'other';
  timestamp: number;
  riskLevel: 'Safe' | 'Suspicious' | 'Scam';
  riskScore?: number;
  aiAnalysis?: string;
  redFlags?: string[];
  recommendations?: string;
  authorUid: string;
  authorName?: string;
  upvotes: number;
  downvotes: number;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const useReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'reports'), orderBy('timestamp', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        upvotes: 0,
        downvotes: 0,
        ...doc.data()
      })) as Report[];
      setReports(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'reports');
    });

    return () => unsubscribe();
  }, []);

  const addReport = async (reportData: Omit<Report, 'id' | 'timestamp' | 'riskLevel' | 'authorUid' | 'authorName' | 'upvotes' | 'downvotes' | 'riskScore' | 'aiAnalysis' | 'redFlags' | 'recommendations'>) => {
    if (!auth.currentUser) return;

    try {
      // 1. AI Analysis
      const aiResult = await analyzeScamReport(reportData.companyName, reportData.role, reportData.description);

      const newReport = {
        ...reportData,
        ...aiResult,
        timestamp: Date.now(),
        authorUid: auth.currentUser.uid,
        authorName: auth.currentUser.displayName || 'Anonymous',
        upvotes: 0,
        downvotes: 0
      };

      await addDoc(collection(db, 'reports'), newReport);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'reports');
    }
  };

  const voteReport = async (reportId: string, type: 'up' | 'down') => {
    if (!auth.currentUser) return;
    const userUid = auth.currentUser.uid;
    const voteId = `${userUid}_${reportId}`;
    const voteRef = doc(db, 'votes', voteId);

    try {
      const voteSnap = await getDocs(query(collection(db, 'votes'), where('reportId', '==', reportId), where('userUid', '==', userUid)));
      
      if (!voteSnap.empty) {
        const existingVote = voteSnap.docs[0].data();
        if (existingVote.type === type) {
          // Remove vote
          await deleteDoc(doc(db, 'votes', voteSnap.docs[0].id));
          await updateDoc(doc(db, 'reports', reportId), {
            [type === 'up' ? 'upvotes' : 'downvotes']: increment(-1)
          });
        } else {
          // Change vote
          await updateDoc(doc(db, 'votes', voteSnap.docs[0].id), { type });
          await updateDoc(doc(db, 'reports', reportId), {
            [type === 'up' ? 'upvotes' : 'downvotes']: increment(1),
            [type === 'up' ? 'downvotes' : 'upvotes']: increment(-1)
          });
        }
      } else {
        // New vote
        await addDoc(collection(db, 'votes'), { reportId, userUid, type });
        await updateDoc(doc(db, 'reports', reportId), {
          [type === 'up' ? 'upvotes' : 'downvotes']: increment(1)
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'votes');
    }
  };

  return { reports, addReport, voteReport, loading };
};
