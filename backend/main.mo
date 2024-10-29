import Bool "mo:base/Bool";
import Int "mo:base/Int";
import Nat "mo:base/Nat";

import Array "mo:base/Array";
import Time "mo:base/Time";
import Text "mo:base/Text";

actor {
  type Post = {
    id: Nat;
    title: Text;
    body: Text;
    author: Text;
    timestamp: Int;
  };

  type Comment = {
    id: Nat;
    postId: Nat;
    author: Text;
    content: Text;
    timestamp: Int;
  };

  stable var posts : [Post] = [];
  stable var comments : [Comment] = [];
  stable var nextPostId : Nat = 0;
  stable var nextCommentId : Nat = 0;

  public func createPost(title: Text, body: Text, author: Text) : async Nat {
    let post : Post = {
      id = nextPostId;
      title = title;
      body = body;
      author = author;
      timestamp = Time.now();
    };
    posts := Array.append(posts, [post]);
    nextPostId += 1;
    nextPostId - 1
  };

  public query func getPosts() : async [Post] {
    Array.reverse(posts)
  };

  public func addComment(postId: Nat, author: Text, content: Text) : async Nat {
    let comment : Comment = {
      id = nextCommentId;
      postId = postId;
      author = author;
      content = content;
      timestamp = Time.now();
    };
    comments := Array.append(comments, [comment]);
    nextCommentId += 1;
    nextCommentId - 1
  };

  public query func getComments(postId: Nat) : async [Comment] {
    Array.filter(comments, func (c: Comment) : Bool { c.postId == postId })
  };
}
