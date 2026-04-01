export interface JwtPayload {
    sub: string;
    email: string;
    type: 'client' | 'broker';
    iat?: number;
    exp?: number;
}
export declare const CurrentUser: (...dataOrPipes: (import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>> | keyof JwtPayload | undefined)[]) => ParameterDecorator;
