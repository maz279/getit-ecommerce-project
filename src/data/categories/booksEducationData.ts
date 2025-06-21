
import { MainCategory } from '../categoriesData';
import { School, GraduationCap, BookOpen, PenTool } from 'lucide-react';
import { academicBooksData } from './booksEducation/academicBooksData';
import { generalBooksData } from './booksEducation/generalBooksData';
import { childrensBooksData } from './booksEducation/childrensBooksData';
import { stationeryData } from './booksEducation/stationeryData';

export const booksEducationData: MainCategory = {
  id: 'books-education',
  name: 'Books & Education',
  icon: <BookOpen className="w-6 h-6" />,
  color: 'text-purple-600',
  count: 15420,
  featured: true,
  subcategories: {
    'academic-books': academicBooksData,
    'general-books': generalBooksData,
    'childrens-books': childrensBooksData,
    'stationery-office': stationeryData
  }
};
