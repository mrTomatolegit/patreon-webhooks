import EventEmitter from 'events';
import { Request, Router } from 'express';

declare module 'patreon-webhooks' {
    type ParseHandler = (value: any, thisArg: any) => any;
    type ReverseHandler = (value: any, thisArg: any) => any;

    type ParseHandlers = {
        [index: string]: [ParseHandler, ReverseHandler];
    };

    type RelationshipsObject = {
        [index: string]: { id: string; type: string };
    };

    export class Base {
        constructor(hub: Hub, data: object, parseHandlers: ParseHandlers | null);
        private hub: Hub;
        private _relationships: RelationshipsObject;
        private _parseHandlers: ParseHandlers;
        public attributes: object;

        /**
         * Returns a link from where to fetch new data
         */
        public get link(): string;

        private parse(data: object): this;
        /**
         * The ID of the object
         */
        public id: string;
        /**
         * Wether the object is partial
         */
        public partial: boolean;
        /**
         * The type of the object
         */
        public type: string;
        /**
         * Returns a flattened version of the class
         */
        public toJSON(): object;
        /**
         * Returns the endpoint from where a type can be fetched
         */
        static resolveApiEndpoint(type: string): string;

        static resolveClass(hub: Hub, data: object): Base;
        /**
         * Fetches the latest data for this object
         * @param cache Wether to update the object and the included data
         */
        public fetch(cache: boolean): Promise<Base>;
    }

    type PatronStatus = 'active_patron' | 'declined_patron' | 'former_patron' | null;

    type ChargeStatus =
        | 'Paid'
        | 'Declined'
        | 'Deleted'
        | 'Pending'
        | 'Refunded'
        | 'Fraud'
        | 'Other'
        | null;

    type MemberAttributes = {
        /**
         * Datetime of pledge expiry. `null` if never pledged
         */
        accessExpiresAt: Date | null;
        /**
         * The currency of the campaign
         */
        campaignCurrency: string;
        /**
         * The total amount that the member has ever paid to the campaign in campaign's currency. `0` if never paid.
         */
        campaignLifetimeSupportCents: number;
        /**
         * The amount in cents that the member is entitled to.
         * This includes a current pledge, or payment that covers the current payment period.
         */
        campaignPledgeAmountCents: number;
        /**
         * Full name of the member user.
         */
        fullName: string;
        /**
         * The user is not a pledging patron but has subscribed to updates about public posts.
         */
        isFollower: boolean;
        lastCharge: {
            /**
             * Datetime of last attempted charge. `null` if never charged
             */
            date: Date | null;
            /**
             * The result of the last attempted charge.
             * The only successful status is `Paid`. `null` if never charged.
             * One of Paid, `Declined`, `Deleted`, `Pending`, `Refunded`, `Fraud`, `Other`.
             * @type {ChargeStatus}
             */
            status: ChargeStatus;
        };
        /**
         * The total amount that the member has ever paid to the campaign. 0 if never paid.
         */
        lifetimeSupportCents: number;
        /**
         * One of `active_patron`, `declined_patron`, `former_patron`.
         * A `null` value indicates the member has never pledged.
         */
        patronStatus: PatronStatus;
        /**
         * The amount in cents the user will pay at the next pay cycle.
         */
        pledgeAmountCents: number;

        /**
         * Datetime of beginning of most recent pledge chain from this member to the campaign.
         * Pledge updates do not change this value.
         */
        pledgeRelationshipStart: Date | null;
    };

    export class Member extends Base {
        constructor(data: object);
        public attributes: MemberAttributes;
        /**
         * The member's address
         */
        public get address(): Address | undefined;
        /**
         * The member's campaign
         */
        public get campaign(): Campaign | undefined;
        /**
         * The user this member references
         */
        public get user(): User | undefined;
    }

    type CampaignAttributes = {
        avatarPhotoUrl: string;
        campaignPledgeSum: number;
        coverPhotoUrl: string;
        coverPhotoUrlSizes: {
            large: string;
            medium: string;
            small: string;
        };
        createdAt: Date;
        creationCount: number;
        creationName: string;
        currency: string;
        discordServerId: string;
        displayPatronGoals: boolean;
        earningsVisibility: 'public' | string;
        imageSmallUrl: string;
        imageUrl: string;
        isChargeUpfront: boolean;
        isChargedImmediately: boolean | null;
        isMonthly: boolean;
        isNsfw: boolean;
        isPlural: boolean;
        mainVideoEmbed: null; // What is this anyway
        mainVideoUrl: string | null;
        name: string;
        oneLiner: string | null;
        outstandingPaymentAmountCents: number;
        patronCount: number;
        payPerName: string;
        pledgeSum: number;
        pledgeSumCurrency: string;
        pledgeUrl: string;
        publishedAt: string;
        summary: string;
        thanksEmbed: null; // What is this anyway
        thanksMsg: string;
        thanksVideoUrl: string;
        url: string;
    };

    export class Campaign extends Base {
        constructor(data: object);
        public attributes: CampaignAttributes;
        private creatorID: string;
        public get creator(): User | undefined;
        public get goals(): Base[];
        public get rewards(): Reward[];
    }

    type SocialConnections = {
        deviantart: {} | null;
        discord: {
            scopes: string[];
            url: string | null;
            userId: string;
        } | null;
        facebook: {} | null;
        google: {} | null;
        instagram: {} | null;
        reddit: {} | null;
        spotify: {} | null;
        twitch: {} | null;
        twitter: {} | null;
        youtube: {} | null;
    };

    type UserAttributes = {
        about: string | null;
        appleId: string | null; // What is this anyway
        canSeeNsfw: boolean | null;
        created: Date;
        defaultCountryCode: string | null;
        discordId: string | null;
        facebook: string | null; // What is this anyway
        facebookId: string | null;
        firstName: string | null;
        fullName: string;
        gender: number;
        google_id: string;
        hasPassword: boolean;
        imageUrl: string | null;
        isDeleted: boolean;
        isEmailVerified: boolean;
        isNuked: boolean;
        isSuspended: boolean;
        lastName: string | null;
        patronCurrency: string | null;
        socialConnections: SocialConnections;
        thumbUrl: string;
        twitch: string | null; // What is this anyway
        twitter: string | null; // What is this anyway
        url: string;
        vanity: string | null;
        youtube: string | null; // What is this anyway
    };

    export class User extends Base {
        constructor(data: object);
        public attributes: UserAttributes;
        public get campaign(): Campaign | undefined;
    }

    type AddressAttributes = {
        addressee: string;
        city: string;
        country: string;
        createdAt: Date | null;
        line1: string | null;
        line2: string | null;
        phoneNumber: string;
        postalCode: string;
        state: string;
        updatedAt: Date | null;
    };

    export class Address extends Base {
        constructor(data: object);
        public attributes: AddressAttributes;
    }

    type RewardAttributes = {
        amount: number;
        amountCents: number;
        createdAt: Date;
        currency: string;
        description: string;
        discordRoleIds: string[];
        editedAt: Date;
        imageUrl: string | null;
        patronAmountCents: number;
        patronCount: number;
        patronCurrency: string;
        postCount: number;
        published: boolean;
        publishedAt: Date | null;
        remaining: number | null;
        requiresShipping: boolean;
        title: string;
        unpublishedAt: Date | null;
        url: string;
        userLimit: number | null;
        welcomeMessage: string | null;
        welcomeMessageUnsafe: string | null;
        welcomeVideoEmbed: object | null; // What even is this
        welcomeVideoUrl: string | null;
    };

    export class Reward extends Base {
        constructor(data: object);
        public attributes: RewardAttributes;
        public get campaign(): Campaign | undefined;
    }

    interface HubEvents {
        all: [Base, string];
        membersCreate: [Member];
        membersUpdate: [Member];
        membersDelete: [Member];
        membersPledgeCreate: [Member];
        membersPledgeUpdate: [Member];
        membersPledgeDelete: [Member];
    }

    export class Hub extends EventEmitter {
        constructor();
        public addresses: Map<string, Address>;
        public campaigns: Map<string, Campaign>;
        public members: Map<string, Member>;
        public rewards: Map<string, Reward>;
        public users: Map<string, User>;
        public parse(data: object): Base;
        public parseApiResponse(req: object): Base;
        /**
         * @requires express
         */
        public webhooks(webhookSecret: string, shouldNext: boolean | null): Router;

        public on<K extends keyof HubEvents>(
            event: K,
            listener: (...args: HubEvents[K]) => void
        ): this;
        public on<S extends string | symbol>(
            event: Exclude<S, keyof HubEvents>,
            listener: (...args: any[]) => void
        ): this;

        public once<K extends keyof HubEvents>(
            event: K,
            listener: (...args: HubEvents[K]) => void
        ): this;
        public once<S extends string | symbol>(
            event: Exclude<S, keyof HubEvents>,
            listener: (...args: any[]) => void
        ): this;

        public emit<K extends keyof HubEvents>(event: K, ...args: HubEvents[K]): boolean;
        public emit<S extends string | symbol>(
            event: Exclude<S, keyof HubEvents>,
            ...args: any[]
        ): boolean;

        public off<K extends keyof HubEvents>(
            event: K,
            listener: (...args: HubEvents[K]) => void
        ): this;
        public off<S extends string | symbol>(
            event: Exclude<S, keyof HubEvents>,
            listener: (...args: any[]) => void
        ): this;

        public removeAllListeners<K extends keyof HubEvents>(event?: K): this;
        public removeAllListeners<S extends string | symbol>(
            event?: Exclude<S, keyof HubEvents>
        ): this;
    }

    export class Util {
        constructor();
        /**
         *
         * @param x Any object
         * @param toClass A class constructor
         * @returns Instance of the provided class constructor
         */
        public static toClassIfExists(x: any, toClass: any): any;
        /**
         *
         * @param str
         * @returns The provided string but with the first letter uppercased
         */
        public static upperFirst(str: string): string;
        public static dateify(dateString: string): Date | string;
        public static isoify(date: Date): string;
        public static snakeToCamel(str: string): string;
        public static patreonEventToCamel(str: string): string;
        public static camelToSnake(str: string): string;
        public static camelCaseObject(obj: object): object;
        public static snakeCaseObject(obj: object): object;
        public static resolvePlural(str: string): string;
        public static verifyPatreonIdentity(req: Request, secret: string): boolean;
    }

    export class PatreonAPIError extends Error {
        constructor(errorData: object);
        public code: number;
        public codeName: string;
        public detail: string;
        public id: string;
        public status: string;
        public title: string;
        public static parse(apiObject: object): PatreonAPIError[];
    }
}
