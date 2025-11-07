import { createReview, replyReview } from "@/api/reviewApi";
import type { ReviewPayload, ReviewReplyPayload } from "@/types/review";
import { showAlert } from "@/utils/showAlert";
import { useState } from "react";

const ReviewCenterPage = () => {
  const [reviewForm, setReviewForm] = useState({
    bookingId: "",
    rating: "5",
    comment: "",
  });

  const [replyForm, setReplyForm] = useState({
    reviewId: "",
    message: "",
  });

  const [submittingReview, setSubmittingReview] = useState(false);
  const [submittingReply, setSubmittingReply] = useState(false);

  const handleCreateReview = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const bookingId = Number(reviewForm.bookingId);
    const rating = Number(reviewForm.rating);

    if (Number.isNaN(bookingId) || Number.isNaN(rating)) {
      showAlert("Booking ID and rating must be numbers", "warning");
      return;
    }

    const payload: ReviewPayload = {
      bookingId,
      rating,
      comment: reviewForm.comment || undefined,
    };

    setSubmittingReview(true);
    try {
      await createReview(payload);
      showAlert("Review submitted", "success");
      setReviewForm({ bookingId: "", rating: "5", comment: "" });
    } catch (error) {
      showAlert("Failed to submit review", "danger");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleReplyReview = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const reviewId = Number(replyForm.reviewId);

    if (Number.isNaN(reviewId)) {
      showAlert("Review ID must be a number", "warning");
      return;
    }

    const payload: ReviewReplyPayload = {
      message: replyForm.message,
    };

    setSubmittingReply(true);
    try {
      await replyReview(reviewId, payload);
      showAlert("Reply sent", "success");
      setReplyForm({ reviewId: "", message: "" });
    } catch (error) {
      showAlert("Unable to send reply", "danger");
    } finally {
      setSubmittingReply(false);
    }
  };

  return (
    <div className="container">
      <div className="mb-4">
        <h1 className="h3 mb-2">Review center</h1>
        <p className="text-muted mb-0">Collect guest feedback and respond to their comments.</p>
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">Submit review</h5>
              <form className="row g-3" onSubmit={handleCreateReview}>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="review-bookingId">
                    Booking ID
                  </label>
                  <input
                    className="form-control"
                    id="review-bookingId"
                    name="bookingId"
                    type="number"
                    min={1}
                    value={reviewForm.bookingId}
                    onChange={(event) =>
                      setReviewForm((prev) => ({ ...prev, bookingId: event.target.value }))
                    }
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="review-rating">
                    Rating
                  </label>
                  <select
                    className="form-select"
                    id="review-rating"
                    name="rating"
                    value={reviewForm.rating}
                    onChange={(event) =>
                      setReviewForm((prev) => ({ ...prev, rating: event.target.value }))
                    }
                  >
                    {[5, 4, 3, 2, 1].map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label" htmlFor="review-comment">
                    Comment
                  </label>
                  <textarea
                    className="form-control"
                    id="review-comment"
                    name="comment"
                    rows={4}
                    placeholder="Share your stay experience"
                    value={reviewForm.comment}
                    onChange={(event) =>
                      setReviewForm((prev) => ({ ...prev, comment: event.target.value }))
                    }
                  />
                </div>
                <div className="col-12 text-end">
                  <button className="btn btn-primary" disabled={submittingReview} type="submit">
                    {submittingReview ? "Submitting..." : "Submit review"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">Reply to review</h5>
              <form className="row g-3" onSubmit={handleReplyReview}>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="reply-reviewId">
                    Review ID
                  </label>
                  <input
                    className="form-control"
                    id="reply-reviewId"
                    name="reviewId"
                    type="number"
                    min={1}
                    value={replyForm.reviewId}
                    onChange={(event) =>
                      setReplyForm((prev) => ({ ...prev, reviewId: event.target.value }))
                    }
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label" htmlFor="reply-message">
                    Message
                  </label>
                  <textarea
                    className="form-control"
                    id="reply-message"
                    name="message"
                    rows={4}
                    placeholder="Thanks for staying with us!"
                    value={replyForm.message}
                    onChange={(event) =>
                      setReplyForm((prev) => ({ ...prev, message: event.target.value }))
                    }
                    required
                  />
                </div>
                <div className="col-12 text-end">
                  <button
                    className="btn btn-outline-primary"
                    disabled={submittingReply}
                    type="submit"
                  >
                    {submittingReply ? "Sending..." : "Send reply"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCenterPage;
