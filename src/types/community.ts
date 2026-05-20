export type CommunityPost = {
  id: string;
  authorNickname: string;
  title: string;
  body: string;
  createdAt: string;
};

export type CommunityComment = {
  id: string;
  postId: string;
  authorNickname: string;
  body: string;
  createdAt: string;
};
