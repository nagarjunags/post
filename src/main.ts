import { PostView } from "./posts-view";
import { CommentsManager, PostManager } from "./post-model";
import { PostController } from "./posts-controller";
const postView = new PostView();
const postManager = new PostManager();
const commentManager = new CommentsManager();
const postController = new PostController(
  postView,
  postManager,
  commentManager
);
