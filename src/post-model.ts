// model
export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}
export interface PostsModel {
  posts: Post[];
  currentPostIndex: number;
  currentPost: () => Post | undefined;
  setModelStatus: (modelStatus: ModelStatus) => void;
  getModelStatus: () => ModelStatus;
}
export interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}
export interface CommentsModel {
  commentsMap: Map<number, Comment[]>;
  insertCommentsForPost: (comments: Comment[], postId: number) => void;
  getCommentsForPost: (postId: number) => Comment[] | undefined;
}
/* Subscriber interface */
export interface Subscriber {
  update: (publisher: Publisher) => void;
}
/** publisher interface **/
export interface Publisher {
  subscribers: Subscriber[];
  subscribe: (subscriber: Subscriber) => void;
  unsubscribe: (subscriber: Subscriber) => void;
  updateSubscribers: () => void;
}
export type ModelStatus = "pending" | "available" | "failure";
export class PostManager implements PostsModel, Publisher {
  public subscribers: Subscriber[] = [];
  public currentPostIndex: number = 0;
  public posts: Post[] = [];
  private modelStatus: ModelStatus = "pending";
  currentPost(): Post | undefined {
    return this.posts[this.currentPostIndex];
  }
  subscribe(subscriber: Subscriber): void {
    if (!this.subscribers.includes(subscriber)) {
      this.subscribers.push(subscriber);
    }
  }
  unsubscribe(subscriber: Subscriber): void {
    if (this.subscribers.includes(subscriber)) {
      this.subscribers = this.subscribers.filter((sub) => sub != sub);
    }
  }
  updateSubscribers(): void {
    this.subscribers.forEach((sub) => sub.update(this));
  }
  setPosts(posts: Post[]): void {
    this.setModelStatus("available");
    this.posts = posts;
    this.updateSubscribers();
  }
  getPosts() {
    return this.posts;
  }
  nextPostIndex() {
    this.currentPostIndex += 1;
    this.updateSubscribers();
  }
  previousPostIndex() {
    this.currentPostIndex -= 1;
    this.updateSubscribers();
  }
  setModelStatus(modelStatus: ModelStatus): void {
    this.modelStatus = modelStatus;
  }
  getModelStatus() {
    return this.modelStatus;
  }
}
export class CommentsManager implements CommentsModel, Publisher {
  public comments: string[] = [];
  public subscribers: Subscriber[] = [];
  public commentModelStatus: ModelStatus = "pending";

  subscribe(subscriber: Subscriber): void {
    if (!this.subscribers.includes(subscriber)) {
      this.subscribers.push(subscriber);
    }
  }
  unsubscribe(subscriber: Subscriber): void {
    if (this.subscribers.includes(subscriber)) {
      this.subscribers = this.subscribers.filter((sub) => sub != sub);
    }
  }
  updateSubscribers(): void {
    this.subscribers.forEach((sub) => sub.update(this));
  }
  commentsMap: Map<number, Comment[]> = new Map();
  insertCommentsForPost(currentComments: Comment[], postId: number): void {
    this.commentsMap.set(postId, currentComments);
    this.comments = currentComments.map((comment) => {
      return "<b>" + comment.name + "</b>" + ":" + comment.body;
    });
    this.commentModelStatus = "available";
  }
  getCommentsForPost(postId: number): Comment[] | undefined {
    return this.commentsMap.get(postId);
  }
  setModelStatus(modelStatus: ModelStatus): void {
    this.commentModelStatus = modelStatus;
  }
}
