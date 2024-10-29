import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Comment {
  'id' : bigint,
  'content' : string,
  'author' : string,
  'timestamp' : bigint,
  'postId' : bigint,
}
export interface Post {
  'id' : bigint,
  'title' : string,
  'body' : string,
  'author' : string,
  'timestamp' : bigint,
}
export interface _SERVICE {
  'addComment' : ActorMethod<[bigint, string, string], bigint>,
  'createPost' : ActorMethod<[string, string, string], bigint>,
  'getComments' : ActorMethod<[bigint], Array<Comment>>,
  'getPosts' : ActorMethod<[], Array<Post>>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
