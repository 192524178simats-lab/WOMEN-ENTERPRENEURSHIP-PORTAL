import React, { useState } from 'react';
import { Modal } from '../../components/Modal';
import { useToast } from '../../context/ToastContext';
import { Banknote, FileText, Send, AlertTriangle } from 'lucide-react';

export const FundingApplicationModal = ({ isOpen, onClose, funding, onSuccess }) => {
  const { addToast } = useToast();
  const [requestedAmount, setRequestedAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [businessPlan, setBusinessPlan] = useState('');
  const [expectedBenefits, setExpectedBenefits] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!funding) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const amt = parseFloat(requestedAmount);
    if (!amt || isNaN(amt)) {
      setError('Please enter a valid funding requested amount.');
      return;
    }

    if (amt < funding.min_amount || amt > funding.max_amount) {
      setError(`Requested amount must be between ₹${funding.min_amount.toLocaleString()} and ₹${funding.max_amount.toLocaleString()}.`);
      return;
    }

    if (!purpose) {
      setError('Please describe the intended purpose for requested funding.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/funding/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('wep_token')}`
        },
        body: JSON.stringify({
          funding_id: funding.id,
          requested_amount: amt,
          purpose,
          business_plan: businessPlan,
          expected_benefits: expectedBenefits,
          docs: ['business_plan_2026.pdf', 'audited_financials.pdf', 'udyam_certificate.pdf']
        })
      });

      const data = await res.json();
      if (res.ok) {
        addToast('success', `Application ${data.application_no} submitted successfully!`);
        onClose();
        if (onSuccess) onSuccess();
      } else {
        setError(data.error || 'Failed to submit funding application.');
      }
    } catch (err) {
      setError('Server error while submitting application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Apply for: ${funding.name}`} maxWidth="700px">
      <form onSubmit={handleSubmit}>
        <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '8px', border: '1px solid #bbf7d0', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.85rem', color: '#166534', fontWeight: '700' }}>
            Funding Type: {funding.funding_type} | Provider: {funding.provider}
          </div>
          <div style={{ fontSize: '1rem', fontWeight: '800', color: '#059669', marginTop: '2px' }}>
            Allowed Amount: ₹{funding.min_amount?.toLocaleString()} - ₹{funding.max_amount?.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#dc2626', fontWeight: '600', marginTop: '2px' }}>
            Deadline: {funding.deadline}
          </div>
        </div>

        {error && (
          <div style={{ padding: '0.75rem 1rem', background: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
            {error}
          </div>
        )}

        <div className="form-group">
          <label>Requested Grant / Funding Amount (₹) *</label>
          <input
            type="number"
            className="form-control"
            placeholder={`Enter amount between ${funding.min_amount} and ${funding.max_amount}`}
            value={requestedAmount}
            onChange={(e) => setRequestedAmount(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Specific Business Purpose & Machinery/Expense Breakdown *</label>
          <textarea
            className="form-control"
            rows="3"
            placeholder="Explain specifically how funds will be deployed (e.g. purchasing equipment, expansion, tech integration)..."
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label>Business Plan Summary & Operational Strategy</label>
          <textarea
            className="form-control"
            rows="3"
            placeholder="Briefly outline target market, revenue projections, and operational model..."
            value={businessPlan}
            onChange={(e) => setBusinessPlan(e.target.value)}
          ></textarea>
        </div>

        <div className="form-group">
          <label>Expected Business Benefits & Employment Impact</label>
          <textarea
            className="form-control"
            rows="2"
            placeholder="Expected increase in revenue, rural livelihoods created, female employment generated..."
            value={expectedBenefits}
            onChange={(e) => setExpectedBenefits(e.target.value)}
          ></textarea>
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            <Send size={16} /> {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
