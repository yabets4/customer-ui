import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';

const ReworkDetailsModal = ({ isOpen, onClose, rework }) => {
  if (!rework) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-bold">Rework Order: {rework.reworkId}</Dialog.Title>
            <button onClick={onClose}><X /></button>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><strong>Original Task:</strong> {rework.originalTask}</div>
            <div><strong>Rework Task:</strong> {rework.reworkTask}</div>
            <div><strong>Product:</strong> {rework.product}</div>
            <div><strong>Reason:</strong> {rework.reason}</div>
            <div><strong>Root Cause:</strong> {rework.rootCause}</div>
            <div><strong>Assigned To:</strong> {rework.assignedTo}</div>
            <div><strong>Priority:</strong> {rework.priority}</div>
            <div><strong>Due Date:</strong> {rework.dueDate}</div>
            <div><strong>Cost Impact:</strong> ETB {rework.costImpact}</div>
            <div><strong>Status:</strong> {rework.status}</div>
            <div><strong>Approver:</strong> {rework.approver}</div>
            <div><strong>Estimated Hours:</strong> {rework.estimatedHours}</div>
            <div><strong>Actual Cost:</strong> {rework.actualCost}</div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Attachments</h3>
            <ul className="list-disc list-inside text-blue-600">
              <li><a href="#">before.jpg</a></li>
              <li><a href="#">after.jpg</a></li>
              <li><a href="#">note.mp3</a></li>
            </ul>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ReworkDetailsModal;
