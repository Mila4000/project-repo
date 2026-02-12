import React, {useState} from 'react'
import { X } from 'lucide-react'; 

import ReceiptPhoto from '../../assets/receipts/gcash.jpg';
import PaymentHistoryModal from './PaymentHistoryModal';
import PayNowModal from './PayNowModal';


function ViewReceiptModal({isOpen, onClose}) {
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isPayOpen, setIsPayOpen] = useState(false);

    if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-2xl w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <div className="w-full flex items-center justify-between mb-6 pb-3 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Proof of Payment</h2>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                    <X className="w-7 h-7 text-slate-600 dark:text-slate-300 cursor-pointer"/>
                </button>
            </div>

            <div className="flex flex-col items-center space-y-1">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Proof of Payment as of: December 10, 2025
                </p>
                <div className="w-full overflow-hidden rounded-xl border border-slate-300 dark:border-slate-700">
                    <img 
                        src={ReceiptPhoto} 
                        alt="Uploaded Receipt" 
                        className="w-full h-auto object-contain max-h-[60vh]"
                    />
                </div>
            </div>

            <div className="pt-5 flex justify-end space-x-3">
                <button type="button" 
                onClick={() => setIsHistoryOpen(true)}
                className="px-4 py-2 text-sm font-medium rounded-md text-slate-700 dark:text-slate-200/90 bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600/80 hover:bg-slate-200/80 transition-colors">
                    View Payment History
                </button>
                <button type="submit" 
                onClick={() => setIsPayOpen(true)}
                className="px-8 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md">
                    Pay
                </button>
            </div>
        </div>

        <PaymentHistoryModal 
            isOpen={isHistoryOpen} 
            onClose={() => setIsHistoryOpen(false)} 
        />
        
        <PayNowModal 
            isOpen={isPayOpen} 
            onClose={() => setIsPayOpen(false)} 
        />
    </div>

  )
};

export default ViewReceiptModal;