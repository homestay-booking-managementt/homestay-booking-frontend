import { initPayment, pollPaymentStatus } from "@/api/paymentApi";
import type { PaymentInitPayload } from "@/types/payment";
import { showAlert } from "@/utils/showAlert";
import { useState } from "react";

const PaymentPortalPage = () => {
  const [formState, setFormState] = useState({
    bookingId: "",
    method: "credit_card",
    returnUrl: "",
  });
  const [pollId, setPollId] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [creating, setCreating] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string>("idle");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreatePayment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const bookingId = Number(formState.bookingId);
    if (Number.isNaN(bookingId)) {
      showAlert("Booking ID must be a number", "warning");
      return;
    }

    const payload: PaymentInitPayload = {
      bookingId,
      method: formState.method as PaymentInitPayload["method"],
      returnUrl: formState.returnUrl || undefined,
    };

    setCreating(true);
    try {
      const data = await initPayment(payload);
      setPollId((prev) => data.paymentId ?? prev ?? null);
      setPaymentUrl(data.checkoutUrl ?? data.paymentUrl ?? null);
      setPaymentStatus(data.status ?? "pending");
      showAlert("Payment session created", "success");
    } catch (error) {
      showAlert("Unable to create payment", "danger");
    } finally {
      setCreating(false);
    }
  };

  const handlePollStatus = async () => {
    if (!pollId) {
      showAlert("Create a payment session first", "info");
      return;
    }

    setChecking(true);
    try {
      const data = await pollPaymentStatus(pollId);
      setPaymentStatus(data.status ?? "unknown");
      showAlert(`Latest payment status: ${data.status ?? "unknown"}`, "success");
    } catch (error) {
      showAlert("Unable to check payment status", "danger");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="container">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4">
        <div>
          <h1 className="h3 mb-2">Payment portal</h1>
          <p className="text-muted mb-0">Generate payment sessions and track their status.</p>
        </div>
        <div className="text-end">
          <div className="fw-semibold">Current status</div>
          <div className="text-uppercase">{paymentStatus}</div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">Create payment</h5>
              <form className="row g-3" onSubmit={handleCreatePayment}>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="payment-bookingId">
                    Booking ID
                  </label>
                  <input
                    className="form-control"
                    id="payment-bookingId"
                    name="bookingId"
                    type="number"
                    min={1}
                    value={formState.bookingId}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="payment-method">
                    Method
                  </label>
                  <select
                    className="form-select"
                    id="payment-method"
                    name="method"
                    value={formState.method}
                    onChange={handleChange}
                  >
                    <option value="credit_card">Credit card</option>
                    <option value="bank_transfer">Bank transfer</option>
                    <option value="e_wallet">E-wallet</option>
                    <option value="VNPAY">VNPay</option>
                    <option value="MOMO">MoMo</option>
                    <option value="CARD">Card</option>
                    <option value="TRANSFER">Bank transfer (legacy)</option>
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label" htmlFor="payment-returnUrl">
                    Return URL (optional)
                  </label>
                  <input
                    className="form-control"
                    id="payment-returnUrl"
                    name="returnUrl"
                    type="url"
                    placeholder="https://example.com/thank-you"
                    value={formState.returnUrl}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-12 text-end">
                  <button className="btn btn-primary" disabled={creating} type="submit">
                    {creating ? "Creating..." : "Create payment"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">Status checker</h5>
              <p className="text-muted small">
                Track the latest status using the generated payment ID.
              </p>
              <div className="mb-3">
                <label className="form-label" htmlFor="payment-pollId">
                  Payment ID
                </label>
                <input
                  className="form-control"
                  id="payment-pollId"
                  name="pollId"
                  value={pollId ?? ""}
                  onChange={(event) => setPollId(event.target.value || null)}
                  placeholder="Automatically filled after creation"
                />
              </div>
              <button
                className="btn btn-outline-primary"
                disabled={checking}
                onClick={handlePollStatus}
                type="button"
              >
                {checking ? "Checking..." : "Check status"}
              </button>
              {paymentUrl ? (
                <div className="alert alert-success mt-3 mb-0">
                  <div className="fw-semibold">Checkout link</div>
                  <a className="text-break" href={paymentUrl} rel="noreferrer" target="_blank">
                    {paymentUrl}
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPortalPage;
