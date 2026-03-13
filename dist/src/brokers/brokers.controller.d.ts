import { BrokersService } from './brokers.service';
export declare class BrokersController {
    private brokers;
    constructor(brokers: BrokersService);
    findAll(): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string;
        creci: string;
        avatar: string | null;
        specialties: string[];
        rating: number;
        totalLeads: number;
    }[]>;
}
