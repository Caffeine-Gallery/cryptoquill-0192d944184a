export const idlFactory = ({ IDL }) => {
  const Comment = IDL.Record({
    'id' : IDL.Nat,
    'content' : IDL.Text,
    'author' : IDL.Text,
    'timestamp' : IDL.Int,
    'postId' : IDL.Nat,
  });
  const Post = IDL.Record({
    'id' : IDL.Nat,
    'title' : IDL.Text,
    'body' : IDL.Text,
    'author' : IDL.Text,
    'timestamp' : IDL.Int,
  });
  return IDL.Service({
    'addComment' : IDL.Func([IDL.Nat, IDL.Text, IDL.Text], [IDL.Nat], []),
    'createPost' : IDL.Func([IDL.Text, IDL.Text, IDL.Text], [IDL.Nat], []),
    'getComments' : IDL.Func([IDL.Nat], [IDL.Vec(Comment)], ['query']),
    'getPosts' : IDL.Func([], [IDL.Vec(Post)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
