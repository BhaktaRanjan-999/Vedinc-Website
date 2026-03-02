export type CreateCourseInput = {
    title: string;
    description: string;
    price: number;
    categoryId: string;
    thumbnail?: string;
    instructorId?: string;
};
