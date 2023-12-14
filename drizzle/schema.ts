import { mysqlTable, mysqlSchema, AnyMySqlColumn, int, varchar, timestamp, index, foreignKey, text, tinyint, date, unique, longtext, char, datetime, decimal, mysqlEnum } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"


export const actions = mysqlTable("actions", {
	id: int("id").autoincrement().notNull(),
	name: varchar("name", { length: 191 }).notNull(),
	description: varchar("description", { length: 191 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('current_timestamp()'),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default('NULL'),
});

export const addresses = mysqlTable("addresses", {
	id: int("id").autoincrement().notNull(),
	userId: int("user_id").notNull().references(() => users.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	address: text("address").notNull(),
	address2: text("address2").notNull(),
	country: text("country").notNull(),
	city: text("city").notNull(),
	zipcode: text("zipcode").notNull(),
	stateProvince: text("state_province").notNull(),
	dateCreated: timestamp("date_created", { mode: 'string' }).default('current_timestamp()').notNull(),
	isExist: tinyint("is_exist").default(1).notNull(),
},
(table) => {
	return {
		userId: index("user_id").on(table.userId),
	}
});

export const campaigns = mysqlTable("campaigns", {
	id: int("id").autoincrement().notNull(),
	name: varchar("name", { length: 191 }).notNull(),
	description: varchar("description", { length: 191 }).notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	startDate: date("start_date", { mode: 'string' }).notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	endDate: date("end_date", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('NULL'),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default('NULL'),
	deletedAt: timestamp("deleted_at", { mode: 'string' }).default('NULL'),
});

export const campaignActionRewards = mysqlTable("campaign_action_rewards", {
	id: int("id").autoincrement().notNull(),
	campaignId: int("campaign_id").notNull().references(() => campaigns.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	actionId: int("action_id").notNull().references(() => actions.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	rewardId: int("reward_id").notNull().references(() => rewards.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	quantity: int("quantity").default(0).notNull(),
	deletedAt: timestamp("deleted_at", { mode: 'string' }).default('NULL'),
	createdAt: timestamp("created_at", { mode: 'string' }).default('NULL'),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default('NULL'),
});

export const companies = mysqlTable("companies", {
	id: int("id").autoincrement().notNull(),
	name: varchar("name", { length: 191 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('NULL'),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default('NULL'),
});

export const exponentPushNotificationInterests = mysqlTable("exponent_push_notification_interests", {
	key: varchar("key", { length: 191 }).notNull(),
	value: varchar("value", { length: 191 }).notNull(),
},
(table) => {
	return {
		keyIdx: index().on(table.key),
		exponentPushNotificationInterestsKeyValueUnique: unique("exponent_push_notification_interests_key_value_unique").on(table.key, table.value),
	}
});

export const failedJobs = mysqlTable("failed_jobs", {
	id: int("id").autoincrement().notNull(),
	uuid: varchar("uuid", { length: 191 }).notNull(),
	connection: text("connection").notNull(),
	queue: text("queue").notNull(),
	payload: longtext("payload").notNull(),
	exception: longtext("exception").notNull(),
	failedAt: timestamp("failed_at", { mode: 'string' }).default('current_timestamp()').notNull(),
},
(table) => {
	return {
		failedJobsUuidUnique: unique("failed_jobs_uuid_unique").on(table.uuid),
	}
});

export const jobs = mysqlTable("jobs", {
	id: int("id").autoincrement().notNull(),
	queue: varchar("queue", { length: 191 }).notNull(),
	payload: longtext("payload").notNull(),
	attempts: tinyint("attempts").notNull(),
	reservedAt: int("reserved_at").default('NULL'),
	availableAt: int("available_at").notNull(),
	createdAt: int("created_at").notNull(),
},
(table) => {
	return {
		queueIdx: index().on(table.queue),
	}
});

export const migrations = mysqlTable("migrations", {
	id: int("id").autoincrement().notNull(),
	migration: varchar("migration", { length: 191 }).notNull(),
	batch: int("batch").notNull(),
});

export const notifications = mysqlTable("notifications", {
	id: char("id", { length: 36 }).notNull(),
	type: varchar("type", { length: 191 }).notNull(),
	notifiableType: varchar("notifiable_type", { length: 191 }).notNull(),
	notifiableId: int("notifiable_id").notNull(),
	data: text("data").notNull(),
	readAt: timestamp("read_at", { mode: 'string' }).default('NULL'),
	createdAt: timestamp("created_at", { mode: 'string' }).default('NULL'),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default('NULL'),
},
(table) => {
	return {
		notifiableTypeNotifiableIdIdx: index().on(table.notifiableType, table.notifiableId),
	}
});

export const oauthAccessTokens = mysqlTable("oauth_access_tokens", {
	id: varchar("id", { length: 100 }).notNull(),
	userId: int("user_id").default('NULL'),
	clientId: int("client_id").notNull(),
	name: varchar("name", { length: 191 }).default('NULL'),
	scopes: text("scopes").default('NULL'),
	revoked: tinyint("revoked").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('NULL'),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default('NULL'),
	expiresAt: datetime("expires_at", { mode: 'string'}).default('NULL'),
},
(table) => {
	return {
		userIdIdx: index().on(table.userId),
	}
});

export const oauthAuthCodes = mysqlTable("oauth_auth_codes", {
	id: varchar("id", { length: 100 }).notNull(),
	userId: int("user_id").notNull(),
	clientId: int("client_id").notNull(),
	scopes: text("scopes").default('NULL'),
	revoked: tinyint("revoked").notNull(),
	expiresAt: datetime("expires_at", { mode: 'string'}).default('NULL'),
},
(table) => {
	return {
		userIdIdx: index().on(table.userId),
	}
});

export const oauthClients = mysqlTable("oauth_clients", {
	id: int("id").autoincrement().notNull(),
	userId: int("user_id").default('NULL'),
	name: varchar("name", { length: 191 }).notNull(),
	secret: varchar("secret", { length: 100 }).default('NULL'),
	provider: varchar("provider", { length: 191 }).default('NULL'),
	redirect: text("redirect").notNull(),
	personalAccessClient: tinyint("personal_access_client").notNull(),
	passwordClient: tinyint("password_client").notNull(),
	revoked: tinyint("revoked").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('NULL'),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default('NULL'),
},
(table) => {
	return {
		userIdIdx: index().on(table.userId),
	}
});

export const oauthPersonalAccessClients = mysqlTable("oauth_personal_access_clients", {
	id: int("id").autoincrement().notNull(),
	clientId: int("client_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('NULL'),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default('NULL'),
});

export const oauthRefreshTokens = mysqlTable("oauth_refresh_tokens", {
	id: varchar("id", { length: 100 }).notNull(),
	accessTokenId: varchar("access_token_id", { length: 100 }).notNull(),
	revoked: tinyint("revoked").notNull(),
	expiresAt: datetime("expires_at", { mode: 'string'}).default('NULL'),
},
(table) => {
	return {
		accessTokenIdIdx: index().on(table.accessTokenId),
	}
});

export const packages = mysqlTable("packages", {
	id: int("id").autoincrement().notNull(),
	name: varchar("name", { length: 191 }).notNull(),
	description: varchar("description", { length: 191 }).notNull(),
	multiplier: decimal("multiplier", { precision: 8, scale: 2 }).default('0.00').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('NULL'),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default('NULL'),
	isExist: tinyint("is_exist").default(1).notNull(),
});

export const packageRewards = mysqlTable("package_rewards", {
	id: int("id").autoincrement().notNull(),
	packageId: int("package_id").notNull().references(() => packages.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	rewardId: int("reward_id").notNull().references(() => rewards.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	createdAt: timestamp("created_at", { mode: 'string' }).default('NULL'),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default('NULL'),
});

export const products = mysqlTable("products", {
	id: int("id").autoincrement().notNull(),
	name: varchar("name", { length: 191 }).notNull(),
	detail: text("detail").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('NULL'),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default('NULL'),
});

export const rewards = mysqlTable("rewards", {
	id: int("id").autoincrement().notNull(),
	name: varchar("name", { length: 191 }).notNull(),
	description: varchar("description", { length: 191 }).notNull(),
	type: mysqlEnum("type", ['item','discount','points']).notNull(),
	value: decimal("value", { precision: 8, scale: 2) unsigne }).default('0.00').notNull(),
	cost: decimal("cost", { precision: 8, scale: 2) unsigne }).default('0.00').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('NULL'),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default('NULL'),
});

export const transactions = mysqlTable("transactions", {
	id: int("id").autoincrement().notNull(),
	type: mysqlEnum("type", ['earn','claim']).default(''earn'').notNull(),
	transactionId: varchar("transaction_id", { length: 191 }).notNull(),
	transactionItemId: int("transaction_item_id").notNull().references(() => transactionItems.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	referenceNo: varchar("reference_no", { length: 191 }).default('NULL'),
	balance: decimal("balance", { precision: 8, scale: 2 }).notNull(),
	cost: decimal("cost", { precision: 8, scale: 2 }).notNull(),
	userId: int("user_id").notNull().references(() => users.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	salespersonId: int("salesperson_id").default('NULL').references(() => users.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	status: mysqlEnum("status", ['pending','cancelled','completed','confirmed']).default(''pending'').notNull(),
	statusUpdatedBy: int("status_updated_by").default('NULL').references(() => users.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	createdAt: timestamp("created_at", { mode: 'string' }).default('NULL'),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default('NULL'),
},
(table) => {
	return {
		transactionsTransactionIdUnique: unique("transactions_transaction_id_unique").on(table.transactionId),
	}
});

export const transactionItems = mysqlTable("transaction_items", {
	id: int("id").autoincrement().notNull(),
	campaignId: int("campaign_id").default('NULL').references(() => campaigns.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	campaignName: varchar("campaign_name", { length: 191 }).default('NULL'),
	actionId: int("action_id").default('NULL').references(() => actions.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	actionName: varchar("action_name", { length: 191 }).default('NULL'),
	rewardId: int("reward_id").default('NULL').references((): AnyMySqlColumn => userRewards.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	total: decimal("total", { precision: 8, scale: 2 }).default('0.00').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('NULL'),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default('NULL'),
});

export const users = mysqlTable("users", {
	id: int("id").autoincrement().notNull(),
	name: varchar("name", { length: 191 }).notNull(),
	firstname: varchar("firstname", { length: 191 }).notNull(),
	middlename: varchar("middlename", { length: 191 }).default('NULL'),
	lastname: varchar("lastname", { length: 191 }).notNull(),
	phoneNumber: varchar("phone_number", { length: 191 }).default('NULL'),
	email: varchar("email", { length: 191 }).notNull(),
	emailVerifiedAt: timestamp("email_verified_at", { mode: 'string' }).default('NULL'),
	password: varchar("password", { length: 191 }).notNull(),
	rememberToken: varchar("remember_token", { length: 100 }).default('NULL'),
	userTypeId: int("user_type_id").default('NULL').references(() => userTypes.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	points: decimal("points", { precision: 8, scale: 2) unsigne }).default('0.00').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('current_timestamp()'),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default('NULL'),
	deletedAt: timestamp("deleted_at", { mode: 'string' }).default('NULL'),
	isExsit: tinyint("is_exsit").default(0).notNull(),
},
(table) => {
	return {
		full: index("full").on(table.name),
	}
});

export const userInfos = mysqlTable("user_infos", {
	id: int("id").autoincrement().notNull(),
	userId: int("user_id").notNull().references(() => users.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	packageId: int("package_id").notNull().references(() => packages.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	customerId: varchar("customer_id", { length: 191 }).notNull(),
	customerInfos: longtext("customer_infos").notNull(),
	salespersonId: int("salesperson_id").notNull().references(() => users.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	createdAt: timestamp("created_at", { mode: 'string' }).default('NULL'),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default('NULL'),
	deletedAt: timestamp("deleted_at", { mode: 'string' }).default('NULL'),
},
(table) => {
	return {
		userInfosCustomerIdUnique: unique("user_infos_customer_id_unique").on(table.customerId),
	}
});

export const userRewards = mysqlTable("user_rewards", {
	id: int("id").autoincrement().notNull(),
	userId: int("user_id").notNull().references(() => users.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	transactionItemId: int("transaction_item_id").notNull().references((): AnyMySqlColumn => transactionItems.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	rewardId: int("reward_id").default('NULL').references(() => rewards.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	rewardName: varchar("reward_name", { length: 191 }).notNull(),
	rewardType: varchar("reward_type", { length: 191 }).notNull(),
	multiplier: decimal("multiplier", { precision: 8, scale: 2 }).default('0.00').notNull(),
	rewardQty: decimal("reward_qty", { precision: 8, scale: 2 }).notNull(),
	claimedQty: decimal("claimed_qty", { precision: 8, scale: 2 }).notNull(),
	status: mysqlEnum("status", ['incomplete','completed']).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('NULL'),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default('NULL'),
	oRewardQuantity: decimal("o_reward_quantity", { precision: 8, scale: 2 }).default('0.00').notNull(),
});

export const userTypes = mysqlTable("user_types", {
	id: int("id").autoincrement().notNull(),
	code: int("code").notNull(),
	name: varchar("name", { length: 191 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('NULL'),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default('NULL'),
});

export const userVehicles = mysqlTable("user_vehicles", {
	id: int("id").autoincrement().notNull(),
	userId: int("user_id").notNull().references(() => users.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	vehicleId: varchar("vehicle_id", { length: 191 }).notNull(),
	vehicleInfo: longtext("vehicle_info").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('NULL'),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default('NULL'),
},
(table) => {
	return {
		userVehiclesVehicleIdUnique: unique("user_vehicles_vehicle_id_unique").on(table.vehicleId),
	}
});

export const websocketsStatisticsEntries = mysqlTable("websockets_statistics_entries", {
	id: int("id").autoincrement().notNull(),
	appId: varchar("app_id", { length: 191 }).notNull(),
	peakConnectionCount: int("peak_connection_count").notNull(),
	websocketMessageCount: int("websocket_message_count").notNull(),
	apiMessageCount: int("api_message_count").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('NULL'),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default('NULL'),
});