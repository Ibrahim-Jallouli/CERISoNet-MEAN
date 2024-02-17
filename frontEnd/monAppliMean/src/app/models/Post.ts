import { Comment } from './Comment';

interface Image {
  url: string;
  title: string;
}

interface Post {
  _id: number;
  identifiant: string;
  date: string;
  hour: string;
  body: string;
  createdBy: number;
  images?: Image;
  likes: number;
  hashtags: string[];
  comments: Comment[];
  shares?: number; 
}

export default Post;
