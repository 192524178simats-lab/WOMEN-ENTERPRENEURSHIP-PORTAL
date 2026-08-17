import React, { useState } from 'react';
import { Modal } from './Modal';
import { useToast } from '../context/ToastContext';
import { FileCheck2, ChevronRight, ChevronLeft, Upload, ShieldCheck, Building2, Banknote, CheckCircle2 } from 'lucide-react';

export const FundingApplicationModal = ({ isOpen, onClose, funding, business, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [requestedAmount, setRequestedAmount] = useState(funding?.max_amount || 100000);
  const [businessPlan, setBusinessPlan] = useState('');
  const [expectedImpact, setExpectedImpact] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { addToast } = useToast();

  const handleNext = () => {
    if (step === 2 && (requestedAmount <= 0 || requestedAmount > funding?.max_amount)) {
      addToast('warning', `Requested amount must be between ₹1 and ₹${funding?.max_amount?.toLocaleString()}`);
      return;
    }

    if (step === 3 && businessPlan.trim().length < 20) {
      addToast('warning', 'Please provide a detailed business plan summary (minimum 20 characters).');
      return;
    }

    setStep(prev => prev + 1);
  };

  const handlePrev = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/funding/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('wep_token')}`
        },
        body: JSON.stringify({
          funding_id: funding.id,
          business_id: business.id,
          requested_amount: parseFloat(requestedAmount),
          business_plan: `BUS-PLAN: ${businessPlan}\nEXPECTED IMPACT: ${expectedImpact}`
        })
      });

      const data = await res.json();
      if (res.ok) {
        addToast('success', data.message || 'Funding application submitted successfully!');
        onSuccess();
        onClose();
      } else {
        addToast('error', data.error || 'Failed to submit application.');
      }
    } catch (err) {
      addToast('error', 'Server error.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Apply for ${funding?.name}`}>
      {/* Progress Steps Indicator */}
      <div style={{ marginBottom: '1.5rem', background: '#f8fafc', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', fontWeight: '700', color: '#64748b' }}>
          <span style={{ color: step >= 1 ? '#0d9488' : '#94a3b8' }}>1. Business Info</span>
          <span style={{ color: step >= 2 ? '#0d9488' : '#94a3b8' }}>2. Grant Amount</span>
          <span style={{ color: step >= 3 ? '#0d9488' : '#94a3b8' }}>3. Business Plan</span>
          <span style={{ color: step >= 4 ? '#0d9488' : '#94a3b8' }}>4. Documents</span>
          <span style={{ color: step >= 5 ? '#0d9488' : '#94a3b8' }}>5. Review & Submit</span>
        </div>
        <div style={{ width: '100%', background: '#e2e8f0', height: '6px', borderRadius: '9999px', marginTop: '6px', overflow: 'hidden' }}>
          <div style={{ width: `${(step / 5) * 100}%`, background: '#0d9488', height: '100%', transition: 'width 0.3s ease' }}></div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Business Information Review */}
        {step === 1 && (
          <div>
            <h4 style={{ color: '#0f172a', marginBottom: '0.75rem' }}>Step 1: Business Information Review</h4>
            <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '8px', border: '1px solid #bbf7d0', marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: '700', color: '#15803d', fontSize: '1rem' }}>{business?.business_name}</div>
              <div style={{ fontSize: '0.85rem', color: '#166534', marginTop: '2px' }}>
                Udyam Registration: {business?.reg_number} | Sector: {business?.sector}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#166534', marginTop: '2px' }}>
                Turnover: ₹{business?.annual_turnover?.toLocaleString()} | Employees: {business?.employees}
              </div>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
              Confirm your verified enterprise details above before proceeding to grant amount selection.
            </p>
          </div>
        )}

        {/* Step 2: Funding Amount Details */}
        {step === 2 && (
          <div>
            <h4 style={{ color: '#0f172a', marginBottom: '0.75rem' }}>Step 2: Grant Requested Amount</h4>
            <div className="form-group">
              <label>Grant Opportunity Name</label>
              <input type="text" className="form-control" value={funding?.name} readOnly disabled />
            </div>

            <div className="form-group">
              <label>Maximum Grant Available</label>
              <input type="text" className="form-control" value={`₹${funding?.max_amount?.toLocaleString()}`} readOnly disabled />
            </div>

            <div className="form-group">
              <label>Requested Grant Amount (INR) *</label>
              <input
                type="number"
                className="form-control"
                value={requestedAmount}
                onChange={(e) => setRequestedAmount(e.target.value)}
                min="1000"
                max={funding?.max_amount}
                required
              />
            </div>
          </div>
        )}

        {/* Step 3: Business Purpose & Plan */}
        {step === 3 && (
          <div>
            <h4 style={{ color: '#0f172a', marginBottom: '0.75rem' }}>Step 3: Capital Allocation & Business Purpose</h4>
            <div className="form-group">
              <label>Business Expansion & Capital Plan Summary *</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Explain how grant capital will be deployed (e.g. machinery procurement, raw material stock, digital marketing)..."
                value={businessPlan}
                onChange={(e) => setBusinessPlan(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label>Expected Business Impact & Job Creation</label>
              <textarea
                className="form-control"
                rows="2"
                placeholder="Expected revenue increase, new female hiring count, or export growth..."
                value={expectedImpact}
                onChange={(e) => setExpectedImpact(e.target.value)}
              ></textarea>
            </div>
          </div>
        )}

        {/* Step 4: Supporting Documents Upload */}
        {step === 4 && (
          <div>
            <h4 style={{ color: '#0f172a', marginBottom: '0.75rem' }}>Step 4: Supporting Document Verification</h4>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
              <div style={{ fontWeight: '600', fontSize: '0.875rem', color: '#0f172a', marginBottom: '0.5rem' }}>Required Attachments:</div>
              <div style={{ fontSize: '0.85rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div>✅ Udyam / GST Registration Document Payload (Attached)</div>
                <div>✅ Detailed Project Cost Estimate & Quotation (Attached)</div>
                <div>✅ Bank Account Cancelled Cheque / Statement (Attached)</div>
              </div>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#0d9488', background: '#ccfbf1', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
              <ShieldCheck size={14} style={{ display: 'inline', marginRight: '4px' }} /> Document payloads automatically verified against registered business profile.
            </div>
          </div>
        )}

        {/* Step 5: Final Review & Submission */}
        {step === 5 && (
          <div>
            <h4 style={{ color: '#0f172a', marginBottom: '0.75rem' }}>Step 5: Final Review & Declaration</h4>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
              <div><strong>Enterprise:</strong> {business?.business_name}</div>
              <div><strong>Scheme/Opportunity:</strong> {funding?.name}</div>
              <div><strong>Requested Capital Amount:</strong> ₹{parseFloat(requestedAmount).toLocaleString()}</div>
              <div><strong>Business Plan Summary:</strong> {businessPlan}</div>
            </div>

            <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>
              By submitting, I solemnly affirm that all business registration details and financial estimates provided are authentic and comply with Ministry of MSME guidelines.
            </div>
          </div>
        )}

        {/* Step Controls */}
        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
          {step > 1 ? (
            <button type="button" className="btn btn-secondary" onClick={handlePrev}>
              <ChevronLeft size={16} /> Back
            </button>
          ) : <div></div>}

          {step < 5 ? (
            <button type="button" className="btn btn-primary" onClick={handleNext}>
              Next Step <ChevronRight size={16} />
            </button>
          ) : (
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              <CheckCircle2 size={16} /> {submitting ? 'Submitting Application...' : 'Confirm & Submit Application'}
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
};
