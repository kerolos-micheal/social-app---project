export interface Iposts {
  _id: string;
  body: string;
  image: string;
  privacy: string;
  user: User;
  sharedPost: null;
  likes: any[];
  createdAt: string;
  commentsCount: number;
  topComment: null;
  sharesCount: number;
  likesCount: number;
  isShare: boolean;
  id: string;
  bookmarked: boolean;
}

interface User {
  _id: string;
  name: string;
  username: string;
  photo: string;
}


export interface SuggestedFriends {
  _id: string;
  name: string;
  username: string;
  photo: string;
  mutualFollowersCount: number;
  followersCount: number;
}
export interface comment {
  _id: string;
  content: string;
  commentCreator: CommentCreator;
  post: string;
  parentComment: null;
  likes: any[];
  createdAt: string;
  repliesCount: number;
  image?: string;
}

interface CommentCreator {
  _id: string;
  name: string;
  username: string;
  photo: string;
}

export interface IUserData {
  _id: string;
  name: string;
  username: string;
  email: string;
  photo: string;
  cover: string;
}

export interface IUserProfile extends IUserData {
  followersCount?: number;
  followingCount?: number;
  followers?: unknown[];
  following?: unknown[];
}
