export interface CreateCustomerDTO {
    name: string,
    email: string,
    cpfCnpj: string,
    adress?: string,
    userId: string
}