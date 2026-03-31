import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangeBrokerPlanDto } from './dto/change-broker-plan.dto';
export declare class UsersController {
    private users;
    constructor(users: UsersService);
    getMe(userId: string): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string;
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
        type: string;
        avatar: string | null;
        creci: string | null;
        subscriptionActive: boolean | null;
    }>;
    changeBrokerPlan(brokerId: string, dto: ChangeBrokerPlanDto): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string;
        type: string;
        avatar: string | null;
        creci: string | null;
        subscriptionActive: boolean | null;
    }>;
}
