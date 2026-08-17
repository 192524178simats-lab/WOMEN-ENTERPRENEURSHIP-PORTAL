import React from 'react';
import { Modal } from './Modal';
import { FileText, Download, CheckCircle, Eye } from 'lucide-react';

export const DocumentViewerModal = ({ isOpen, onClose, title = 'Application Supporting Documents', docs = [] }) => {
  const docList = Array.isArray(docs) ? docs : typeof docs === 'string' ? docs.split(',').map(s => s.trim()) : [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <p style={{ color: '#475569', fontSize: '0.9rem' }}>
          Official supporting documents uploaded for verification and review:
        </p>

        {docList.length === 0 ? (
          <div style={{ padding: '1.5rem', textAlign: 'center', background: '#f8fafc', borderRadius: '8px', color: '#64748b' }}>
            No documents attached.
          </div>
        ) : (
          docList.map((doc, idx) => (
            <div key={idx} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.85rem 1rem',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              background: '#ffffff'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FileText size={22} color="#0d9488" />
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.875rem', color: '#0f172a' }}>{doc}</div>
                  <div style={{ fontSize: '0.75rem', color: '#15803d', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle size={12} /> Digitally Signed & Verified
                  </div>
                </div>
              </div>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => alert(`Downloading official copy of: ${doc}`)}
              >
                <Download size={14} /> Download
              </button>
            </div>
          ))
        )}

        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={onClose}>Close Viewer</button>
        </div>
      </div>
    </Modal>
  );
};
