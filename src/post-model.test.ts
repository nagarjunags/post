import {
  Post,
  Comment,
  PostManager,
  CommentsManager,
  Subscriber,
  Publisher,
} from "./post-model";

const testPosts: Post[] = [
  {
    userId: 1,
    id: 1,
    title:
      "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
    body: "quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto",
  },
  {
    userId: 1,
    id: 2,
    title: "qui est esse",
    body: "est rerum tempore vitae sequi sint nihil reprehenderit dolor beatae ea dolores neque fugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis qui aperiam non debitis possimus qui neque nisi nulla",
  },
  {
    userId: 1,
    id: 3,
    title: "ea molestias quasi exercitationem repellat qui ipsa sit aut",
    body: "et iusto sed quo iure voluptatem occaecati omnis eligendi aut ad voluptatem doloribus vel accusantium quis pariatur molestiae porro eius odio et labore et velit aut",
  },
  {
    userId: 1,
    id: 4,
    title: "eum et est occaecati",
    body: "ullam et saepe reiciendis voluptatem adipisci sit amet autem assumenda provident rerum culpa quis hic commodi nesciunt rem tenetur doloremque ipsam iure quis sunt voluptatem rerum illo velit",
  },
  {
    userId: 1,
    id: 5,
    title: "nesciunt quas odio",
    body: "repudiandae veniam quaerat sunt sed alias aut fugiat sit autem sed est voluptatem omnis possimus esse voluptatibus quis est aut tenetur dolor neque",
  },
  {
    userId: 1,
    id: 6,
    title: "dolorem eum magni eos aperiam quia",
    body: "ut aspernatur corporis harum nihil quis provident sequi mollitia nobis aliquid molestiae perspiciatis et ea nemo ab reprehenderit accusantium quas voluptate dolores velit et doloremque molestiae",
  },
  {
    userId: 1,
    id: 7,
    title: "magnam facilis autem",
    body: "dolore placeat quibusdam ea quo vitae magni quis enim qui quis quo nemo aut saepe quidem repellat excepturi ut quia sunt ut sequi eos ea sed quas",
  },
];
describe("Model layer tests", () => {
  test("Post Data layer tests", () => {
    const postManager = new PostManager();
    postManager.posts = testPosts;
    expect(postManager).toBeDefined;
    expect(postManager.currentPostIndex).toBe(0);
    expect(postManager.posts).toBe(testPosts);
    postManager.currentPostIndex = 2;
    expect(postManager.currentPost()).toBe(testPosts[2]);
  });
});

// This is a dummy subscriber just for testing

class DummyView implements Subscriber {
  update(publisher?: Publisher | undefined): void {
    console.log(publisher);
  }
}

describe("Pub Sub Tests with posts model", () => {
  test("update", () => {
    const postManager = new PostManager();
    postManager.posts = testPosts;
    expect(postManager).toBeDefined;
    expect(postManager.currentPostIndex).toBe(0);

    // Setup subscriber
    const dummyView = new DummyView();
    postManager.subscribe(dummyView);

    const dummyView2 = new DummyView();
    postManager.subscribe(dummyView2);

    const spy = vi.spyOn(dummyView, "update");
    const spy2 = vi.spyOn(dummyView2, "update");
    expect(spy.getMockName()).toEqual("update");
    expect(spy2.getMockName()).toEqual("update");
    console.log(spy);
  });
});
