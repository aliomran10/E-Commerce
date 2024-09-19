import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ReviewsService } from '../services/reviews.service';
import { Pagination } from '../interfaces/pagination';
import { GlobalService } from '../services/global.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.scss'
})
export class ReviewsComponent implements OnInit, OnDestroy {
  subscription: any;
  reviews: any[] = [];
  reviewsLength: number = 0;
  page: number = 1;
  pagination: Pagination = {};
  search: string = ''
  productImage: string = '';
  isEditingReview: { [key: string]: boolean } = {};

  updateReviewForm = new FormGroup({
    comment: new FormControl(null, [Validators.required]),
    rating: new FormControl(null, [Validators.required])
  })

  constructor(private _AuthService: AuthService, private _ReviewsService: ReviewsService, private _GlobalService: GlobalService, private _Router: Router) { }

  toggleEdit(reviewId: string): void {
    // Toggle the editing state for the specific review
    if (this.isEditingReview[reviewId]) {
      // If already editing, set it to false to hide the form
      this.isEditingReview[reviewId] = false;
    } else {
      // Otherwise, set it to true to show the form
      this.isEditingReview[reviewId] = true;
    }
  }

  loadReviews() {
    this.subscription = this._ReviewsService.getUserReviews(undefined, this.page, '-createdAt', this.search).subscribe({
      next: (res) => {
        this.reviews = res.data;
        this.pagination = res.pagination;
        this.reviewsLength = res.length;
      }
    })
  }

  updateReview(reviewId: string, formData:FormGroup){
    this._ReviewsService.updateUserReview(reviewId, formData).subscribe({
      next: (res) => {
        this._Router.navigate(['/home']);
      }
    })
  }

  deleteReview(reviewId: string) {
    this._ReviewsService.deleteUserReview(reviewId).subscribe({
      next: (res) => {
        this.loadReviews();
      }
    })
  }

  changePage(page: number) {
    this.page = page;
    this.loadReviews();
  }

  ngOnInit(): void {
    this._AuthService.checkToken();
    this.productImage = this._GlobalService.productsImages;
    this.loadReviews();
  }

  ngOnDestroy(): void { this.subscription.unsubscribe() };
}
