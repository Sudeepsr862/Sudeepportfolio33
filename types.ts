
export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
}

export interface Skill {
  name: string;
  level: number;
  icon: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
