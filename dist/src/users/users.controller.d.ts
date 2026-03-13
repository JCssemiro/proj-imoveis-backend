import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class UsersController {
    private users;
    constructor(users: UsersService);
    getMe(userId: string): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string;
        cpf: string | null;
        type: string;
        avatar: string | null;
        creci: string | null;
        subscriptionActive: boolean | null;
    }>;
    updateMe(userId: string, dto: UpdateProfileDto): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string;
        cpf: string | null;
        type: string;
        avatar: string | null;
        creci: string | null;
        subscriptionActive: boolean | null;
    }>;
}
