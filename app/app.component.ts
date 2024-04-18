import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Post } from './post.module';
import { PostService } from './post.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('postForm') postForm!: NgForm;
  loadedPosts: Post[] = [];
  isFetching = false;
  error = null;
  private errorSub: Subscription;

  constructor(
    private http: HttpClient,
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.errorSub = this.postService.error.subscribe((errorMessage) => {
      this.error = errorMessage;
    });

    this.isFetching = true;

    this.postService.fetchPost().subscribe((post) => {
      this.isFetching = false;
      this.loadedPosts = post;
    });
  }

  onCreatePost(postData: Post) {
    this.postService.createAndStorePost(postData.title, postData.content);
    this.postForm.resetForm();
  }

  onFetchPosts() {
    // this.isFetching = true;

    // this.postService.fetchPost().subscribe(
    //   (post) => {
    //     this.isFetching = false;
    //     this.loadedPosts = post;
    //   },
    //   (error) => {
    //     this.isFetching = false;
    //     this.error = error.status;
    //   }
    // );

    this.isFetching = true;

    this.postService
      .fetchPost()
      .toPromise()
      .then((posts) => {
        this.isFetching = false;
        this.loadedPosts = posts;
      })
      .catch((error) => {
        console.log(error.name);
        this.error = error.name;
        this.isFetching = false;
      });
  }

  onClearPosts() {
    this.postService.deletePost().subscribe(() => {
      this.loadedPosts = [];
    });
  }
  selectedPost(index: number) {
    console.log(this.loadedPosts[index]);
    this.router.navigate([index + 1]);
  }

  onHandleError() {
    this.error = null;
  }

  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }
}
