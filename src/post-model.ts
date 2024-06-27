import { ActualPublisher, Publisher, Subscriber, ModelStatus } from "./pub-sub";
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

export class PostManager
  extends ActualPublisher
  implements PostsModel, Publisher
{
  public subscribers: Subscriber[] = [];
  public currentPostIndex: number = 0;
  public posts: Post[] = [];

  currentPost(): Post | undefined {
    return this.posts[this.currentPostIndex];
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
}
export class CommentsManager
  extends ActualPublisher
  implements CommentsModel, Publisher
{
  public comments: string[] = [];
  public subscribers: Subscriber[] = [];
  public modelStatus: ModelStatus = "pending";

  commentsMap: Map<number, Comment[]> = new Map();
  insertCommentsForPost(currentComments: Comment[], postId: number): void {
    this.commentsMap.set(postId, currentComments);
    this.comments = currentComments.map((comment) => {
      return "<b>" + comment.name + "</b>" + ":" + comment.body;
    });
    this.modelStatus = "available";
  }
  getCommentsForPost(postId: number): Comment[] | undefined {
    return this.commentsMap.get(postId);
  }
}
