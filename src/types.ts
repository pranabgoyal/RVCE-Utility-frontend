export interface Resource {
    _id: string;
    title: string;
    description?: string;
    category: string;
    branch: string;
    year: number;
    semester: string;
    subject: string;
    fileUrl: string;
    downloads: number;
    createdAt: string;
}
