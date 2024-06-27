// post controller
import { PostManager, Post, CommentsManager, Comment } from "./post-model";
import { PostView } from "./posts-view";
export class PostController {
  commentManager: CommentsManager;
  postView: PostView;
  constructor(
    postView: PostView,
    postManager: PostManager,
    commentManager: CommentsManager
  ) {
    this.postView = postView;
    this.commentManager = commentManager;
    function handlePrevious(): void {
      postManager.previousPostIndex();
      postView.update(postManager);
    }
    function handleNext(): void {
      postManager.nextPostIndex();
      postView.update(postManager);
    }
    const handelComments = () => {
      commentManager.setModelStatus("pending");
      postView.update(commentManager);
      this.fetchComments(postManager.currentPostIndex + 1).then((comments) => {
        console.log(comments);
        commentManager.insertCommentsForPost(
          comments,
          postManager.currentPostIndex + 1
        );
        postView.update(commentManager);
        // console.log(commentManager.commentsMap);
      });
    };
    postManager.subscribe(postView);
    //setup event handlers for prev and next buttons.
    postView.nextButton?.addEventListener("click", handleNext);
    postView.prevButton?.addEventListener("click", handlePrevious);
    postView.commentButton?.addEventListener("click", handelComments);
    postManager.setModelStatus("pending");
    postManager.updateSubscribers();
    console.log(postManager.getModelStatus());
    this.fetchPosts()
      .then((posts) => {
        postManager.setPosts(posts);
        postView.update(postManager);
      })
      .catch(() => {
        postManager.setModelStatus("failure");
        postView.update(postManager);
      });
  }
  async fetchPosts(): Promise<Post[]> {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      );
      if (!response.ok) {
        throw new Error("Unable to fetch the data");
      }
      const posts = (await response.json()) as Post[];
      const delay = (timeout: number) =>
        new Promise((resolve) => setTimeout(resolve, timeout));
      await delay(3000);
      return posts;
    } catch (error: unknown) {
      throw new Error("could not fetch api at this time");
    }
  }
  //for comments
  // comments: Comment[] = [];
  async fetchComments(PostId: number): Promise<Comment[]> {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/comments?postId=${PostId}`
      );
      if (!response.ok) {
        throw new Error("Unable to fetch the data");
      }
      const comments = (await response.json()) as Comment[];
      const delay = (timeout: number) =>
        new Promise((resolve) => setTimeout(resolve, timeout));
      await delay(3000); // simulating the network latency.
      return comments;
    } catch (error: unknown) {
      this.commentManager.setModelStatus("failure");
      this.postView.update(this.commentManager);
      throw new Error("could not fetch api at this time");
    }
  }
}
