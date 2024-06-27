// view
import "./style.css";
import "./posts.css";
import {
  Subscriber,
  Publisher,
  PostManager,
  CommentsManager,
} from "./post-model";
export class PostView implements Subscriber {
  postTitleElement: HTMLHeadingElement | null = null;
  postDescription: HTMLParagraphElement | null = null;
  prevButton: HTMLButtonElement | null = null;
  nextButton: HTMLButtonElement | null = null;
  commentButton: HTMLButtonElement | null = null;
  commentsDisplay: HTMLParagraphElement | null = null;
  constructor() {
    document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="container">
  <section>
  <nav>
    <button data-testid="prev-button">< Previous</button>
    <h2></h2>
    <button data-testid="next-button">Next ></button>
    </nav>
    <p class="post-desc" data-testid="post-desc"></p>
    </section>
    <section>
    <button data-testid="comment-button">View Comments</button>
    <p class="comments"  data-testid="comments-p">comments of current post goes here</p>
    </section>
  </div>
`;
    this.postTitleElement = document.querySelector("h2");
    this.postDescription = document.querySelector('[data-testid="post-desc"]');
    this.prevButton = document.querySelector('[data-testid="prev-button"]');
    this.nextButton = document.querySelector('[data-testid="next-button"]');
    this.commentButton = document.querySelector(
      '[data-testid="comment-button"]'
    );
    this.commentsDisplay = document.querySelector('[data-testid="comments-p"]');
    // this.commentsDisplay.innerHTML = "";
    console.assert(this.postTitleElement !== null);
    console.assert(this.postDescription !== null);
    console.assert(this.prevButton !== null);
    console.assert(this.nextButton !== null);
    console.assert(this.commentButton !== null);
  }
  update(manager: Publisher) {
    this.commentsDisplay.innerHTML = "";
    if (manager instanceof PostManager) {
      //check if model is in aveleble state, if then consume data
      //if status is pending then some one is initiated fetch
      //so data is not avelebel so user should know progress
      //time to fetch in this case is unknown so show some spinning item or loading
      //if the model goes into failure, that also should be shown to user
      const modelStatus = manager.getModelStatus();
      switch (modelStatus) {
        case "available": {
          const post = manager.currentPost();
          if (this.postTitleElement !== null) {
            this.postTitleElement.textContent =
              post?.title ?? "title is missing";
          }
          if (this.postDescription) {
            this.postDescription.textContent = post?.title ?? "body is missing";
          }
          break;
        }
        case "pending": {
          if (this.postTitleElement) {
            this.postTitleElement.textContent = "Loading....";
          }
          if (this.postDescription) {
            this.postDescription.textContent = "Loading...";
          }
          break;
        }
        case "failure": {
          if (this.postTitleElement) {
            this.postTitleElement.textContent = "Fail to fetch Title";
          }
          if (this.postDescription) {
            this.postDescription.textContent = "failde to fetch Body";
          }
          break;
        }
      }
    }
    if (manager instanceof CommentsManager) {
      let modelStatus = manager.commentModelStatus;
      switch (modelStatus) {
        case "available": {
          this.commentsDisplay.innerHTML = manager.comments.reduce(
            (acc, comment) => {
              return acc + comment + "<br><br><hr>";
            }
          );
          break;
        }
        case "pending":
          {
            this.commentsDisplay.innerHTML = "Loading....";
          }
          break;

        case "failure": {
          this.commentsDisplay.innerHTML = "ERROR!....";
          break;
        }
      }
    }
  }
}
