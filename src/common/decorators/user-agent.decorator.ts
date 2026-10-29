import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export const UserAgent = createParamDecorator(
    (_data: unknown, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest() as Request;

        return request.headers["user-agent"];
    }
)