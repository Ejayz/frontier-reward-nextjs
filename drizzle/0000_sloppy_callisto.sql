-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `actions` (
	`id` int(10) unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(191) NOT NULL,
	`description` varchar(191) NOT NULL,
	`created_at` timestamp DEFAULT 'current_timestamp()',
	`updated_at` timestamp DEFAULT 'NULL'
);
--> statement-breakpoint
CREATE TABLE `addresses` (
	`id` int(4) unsigned AUTO_INCREMENT NOT NULL,
	`user_id` int(4) unsigned NOT NULL,
	`address` text NOT NULL,
	`address2` text NOT NULL,
	`country` text NOT NULL,
	`city` text NOT NULL,
	`zipcode` text NOT NULL,
	`state_province` text NOT NULL,
	`date_created` timestamp NOT NULL DEFAULT 'current_timestamp()',
	`is_exist` tinyint NOT NULL DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE `campaigns` (
	`id` int(10) unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(191) NOT NULL,
	`description` varchar(191) NOT NULL,
	`start_date` date NOT NULL,
	`end_date` date NOT NULL,
	`created_at` timestamp DEFAULT 'NULL',
	`updated_at` timestamp DEFAULT 'NULL',
	`deleted_at` timestamp DEFAULT 'NULL'
);
--> statement-breakpoint
CREATE TABLE `campaign_action_rewards` (
	`id` int(10) unsigned AUTO_INCREMENT NOT NULL,
	`campaign_id` int(10) unsigned NOT NULL,
	`action_id` int(10) unsigned NOT NULL,
	`reward_id` int(10) unsigned NOT NULL,
	`quantity` int(11) NOT NULL DEFAULT 0,
	`deleted_at` timestamp DEFAULT 'NULL',
	`created_at` timestamp DEFAULT 'NULL',
	`updated_at` timestamp DEFAULT 'NULL'
);
--> statement-breakpoint
CREATE TABLE `companies` (
	`id` int(10) unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(191) NOT NULL,
	`created_at` timestamp DEFAULT 'NULL',
	`updated_at` timestamp DEFAULT 'NULL'
);
--> statement-breakpoint
CREATE TABLE `exponent_push_notification_interests` (
	`key` varchar(191) NOT NULL,
	`value` varchar(191) NOT NULL,
	CONSTRAINT `exponent_push_notification_interests_key_value_unique` UNIQUE(`key`,`value`)
);
--> statement-breakpoint
CREATE TABLE `failed_jobs` (
	`id` int(10) unsigned AUTO_INCREMENT NOT NULL,
	`uuid` varchar(191) NOT NULL,
	`connection` text NOT NULL,
	`queue` text NOT NULL,
	`payload` longtext NOT NULL,
	`exception` longtext NOT NULL,
	`failed_at` timestamp NOT NULL DEFAULT 'current_timestamp()',
	CONSTRAINT `failed_jobs_uuid_unique` UNIQUE(`uuid`)
);
--> statement-breakpoint
CREATE TABLE `jobs` (
	`id` int(10) unsigned AUTO_INCREMENT NOT NULL,
	`queue` varchar(191) NOT NULL,
	`payload` longtext NOT NULL,
	`attempts` tinyint NOT NULL,
	`reserved_at` int(10) unsigned DEFAULT 'NULL',
	`available_at` int(10) unsigned NOT NULL,
	`created_at` int(10) unsigned NOT NULL
);
--> statement-breakpoint
CREATE TABLE `migrations` (
	`id` int(10) unsigned AUTO_INCREMENT NOT NULL,
	`migration` varchar(191) NOT NULL,
	`batch` int(11) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` char(36) NOT NULL,
	`type` varchar(191) NOT NULL,
	`notifiable_type` varchar(191) NOT NULL,
	`notifiable_id` int(10) unsigned NOT NULL,
	`data` text NOT NULL,
	`read_at` timestamp DEFAULT 'NULL',
	`created_at` timestamp DEFAULT 'NULL',
	`updated_at` timestamp DEFAULT 'NULL'
);
--> statement-breakpoint
CREATE TABLE `oauth_access_tokens` (
	`id` varchar(100) NOT NULL,
	`user_id` int(10) unsigned DEFAULT 'NULL',
	`client_id` int(10) unsigned NOT NULL,
	`name` varchar(191) DEFAULT 'NULL',
	`scopes` text DEFAULT 'NULL',
	`revoked` tinyint NOT NULL,
	`created_at` timestamp DEFAULT 'NULL',
	`updated_at` timestamp DEFAULT 'NULL',
	`expires_at` datetime DEFAULT 'NULL'
);
--> statement-breakpoint
CREATE TABLE `oauth_auth_codes` (
	`id` varchar(100) NOT NULL,
	`user_id` int(10) unsigned NOT NULL,
	`client_id` int(10) unsigned NOT NULL,
	`scopes` text DEFAULT 'NULL',
	`revoked` tinyint NOT NULL,
	`expires_at` datetime DEFAULT 'NULL'
);
--> statement-breakpoint
CREATE TABLE `oauth_clients` (
	`id` int(10) unsigned AUTO_INCREMENT NOT NULL,
	`user_id` int(10) unsigned DEFAULT 'NULL',
	`name` varchar(191) NOT NULL,
	`secret` varchar(100) DEFAULT 'NULL',
	`provider` varchar(191) DEFAULT 'NULL',
	`redirect` text NOT NULL,
	`personal_access_client` tinyint NOT NULL,
	`password_client` tinyint NOT NULL,
	`revoked` tinyint NOT NULL,
	`created_at` timestamp DEFAULT 'NULL',
	`updated_at` timestamp DEFAULT 'NULL'
);
--> statement-breakpoint
CREATE TABLE `oauth_personal_access_clients` (
	`id` int(10) unsigned AUTO_INCREMENT NOT NULL,
	`client_id` int(10) unsigned NOT NULL,
	`created_at` timestamp DEFAULT 'NULL',
	`updated_at` timestamp DEFAULT 'NULL'
);
--> statement-breakpoint
CREATE TABLE `oauth_refresh_tokens` (
	`id` varchar(100) NOT NULL,
	`access_token_id` varchar(100) NOT NULL,
	`revoked` tinyint NOT NULL,
	`expires_at` datetime DEFAULT 'NULL'
);
--> statement-breakpoint
CREATE TABLE `packages` (
	`id` int(10) unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(191) NOT NULL,
	`description` varchar(191) NOT NULL,
	`multiplier` decimal(8,2) NOT NULL DEFAULT '0.00',
	`created_at` timestamp DEFAULT 'NULL',
	`updated_at` timestamp DEFAULT 'NULL',
	`is_exist` tinyint NOT NULL DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE `package_rewards` (
	`id` int(10) unsigned AUTO_INCREMENT NOT NULL,
	`package_id` int(10) unsigned NOT NULL,
	`reward_id` int(10) unsigned NOT NULL,
	`created_at` timestamp DEFAULT 'NULL',
	`updated_at` timestamp DEFAULT 'NULL'
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int(10) unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(191) NOT NULL,
	`detail` text NOT NULL,
	`created_at` timestamp DEFAULT 'NULL',
	`updated_at` timestamp DEFAULT 'NULL'
);
--> statement-breakpoint
CREATE TABLE `rewards` (
	`id` int(10) unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(191) NOT NULL,
	`description` varchar(191) NOT NULL,
	`type` enum('item','discount','points') NOT NULL,
	`value` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
	`cost` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
	`created_at` timestamp DEFAULT 'NULL',
	`updated_at` timestamp DEFAULT 'NULL'
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` int(10) unsigned AUTO_INCREMENT NOT NULL,
	`type` enum('earn','claim') NOT NULL DEFAULT ''earn'',
	`transaction_id` varchar(191) NOT NULL,
	`transaction_item_id` int(10) unsigned NOT NULL,
	`reference_no` varchar(191) DEFAULT 'NULL',
	`balance` decimal(8,2) NOT NULL,
	`cost` decimal(8,2) NOT NULL,
	`user_id` int(10) unsigned NOT NULL,
	`salesperson_id` int(10) unsigned DEFAULT 'NULL',
	`status` enum('pending','cancelled','completed','confirmed') NOT NULL DEFAULT ''pending'',
	`status_updated_by` int(10) unsigned DEFAULT 'NULL',
	`created_at` timestamp DEFAULT 'NULL',
	`updated_at` timestamp DEFAULT 'NULL',
	CONSTRAINT `transactions_transaction_id_unique` UNIQUE(`transaction_id`)
);
--> statement-breakpoint
CREATE TABLE `transaction_items` (
	`id` int(10) unsigned AUTO_INCREMENT NOT NULL,
	`campaign_id` int(10) unsigned DEFAULT 'NULL',
	`campaign_name` varchar(191) DEFAULT 'NULL',
	`action_id` int(10) unsigned DEFAULT 'NULL',
	`action_name` varchar(191) DEFAULT 'NULL',
	`reward_id` int(10) unsigned DEFAULT 'NULL',
	`total` decimal(8,2) NOT NULL DEFAULT '0.00',
	`created_at` timestamp DEFAULT 'NULL',
	`updated_at` timestamp DEFAULT 'NULL'
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int(10) unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(191) NOT NULL,
	`firstname` varchar(191) NOT NULL,
	`middlename` varchar(191) DEFAULT 'NULL',
	`lastname` varchar(191) NOT NULL,
	`phone_number` varchar(191) DEFAULT 'NULL',
	`email` varchar(191) NOT NULL,
	`email_verified_at` timestamp DEFAULT 'NULL',
	`password` varchar(191) NOT NULL,
	`remember_token` varchar(100) DEFAULT 'NULL',
	`user_type_id` int(10) unsigned DEFAULT 'NULL',
	`points` decimal(8,2) unsigned NOT NULL DEFAULT '0.00',
	`created_at` timestamp DEFAULT 'current_timestamp()',
	`updated_at` timestamp DEFAULT 'NULL',
	`deleted_at` timestamp DEFAULT 'NULL',
	`is_exsit` tinyint NOT NULL DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE `user_infos` (
	`id` int(10) unsigned AUTO_INCREMENT NOT NULL,
	`user_id` int(10) unsigned NOT NULL,
	`package_id` int(10) unsigned NOT NULL,
	`customer_id` varchar(191) NOT NULL,
	`customer_infos` longtext NOT NULL,
	`salesperson_id` int(10) unsigned NOT NULL,
	`created_at` timestamp DEFAULT 'NULL',
	`updated_at` timestamp DEFAULT 'NULL',
	`deleted_at` timestamp DEFAULT 'NULL',
	CONSTRAINT `user_infos_customer_id_unique` UNIQUE(`customer_id`)
);
--> statement-breakpoint
CREATE TABLE `user_rewards` (
	`id` int(10) unsigned AUTO_INCREMENT NOT NULL,
	`user_id` int(10) unsigned NOT NULL,
	`transaction_item_id` int(10) unsigned NOT NULL,
	`reward_id` int(10) unsigned DEFAULT 'NULL',
	`reward_name` varchar(191) NOT NULL,
	`reward_type` varchar(191) NOT NULL,
	`multiplier` decimal(8,2) NOT NULL DEFAULT '0.00',
	`reward_qty` decimal(8,2) NOT NULL,
	`claimed_qty` decimal(8,2) NOT NULL,
	`status` enum('incomplete','completed') NOT NULL,
	`created_at` timestamp DEFAULT 'NULL',
	`updated_at` timestamp DEFAULT 'NULL',
	`o_reward_quantity` decimal(8,2) NOT NULL DEFAULT '0.00'
);
--> statement-breakpoint
CREATE TABLE `user_types` (
	`id` int(10) unsigned AUTO_INCREMENT NOT NULL,
	`code` int(11) NOT NULL,
	`name` varchar(191) NOT NULL,
	`created_at` timestamp DEFAULT 'NULL',
	`updated_at` timestamp DEFAULT 'NULL'
);
--> statement-breakpoint
CREATE TABLE `user_vehicles` (
	`id` int(10) unsigned AUTO_INCREMENT NOT NULL,
	`user_id` int(10) unsigned NOT NULL,
	`vehicle_id` varchar(191) NOT NULL,
	`vehicle_info` longtext NOT NULL,
	`created_at` timestamp DEFAULT 'NULL',
	`updated_at` timestamp DEFAULT 'NULL',
	CONSTRAINT `user_vehicles_vehicle_id_unique` UNIQUE(`vehicle_id`)
);
--> statement-breakpoint
CREATE TABLE `websockets_statistics_entries` (
	`id` int(10) unsigned AUTO_INCREMENT NOT NULL,
	`app_id` varchar(191) NOT NULL,
	`peak_connection_count` int(11) NOT NULL,
	`websocket_message_count` int(11) NOT NULL,
	`api_message_count` int(11) NOT NULL,
	`created_at` timestamp DEFAULT 'NULL',
	`updated_at` timestamp DEFAULT 'NULL'
);
--> statement-breakpoint
CREATE INDEX `user_id` ON `addresses` (`user_id`);--> statement-breakpoint
CREATE INDEX `exponent_push_notification_interests_key_index` ON `exponent_push_notification_interests` (`key`);--> statement-breakpoint
CREATE INDEX `jobs_queue_index` ON `jobs` (`queue`);--> statement-breakpoint
CREATE INDEX `notifications_notifiable_type_notifiable_id_index` ON `notifications` (`notifiable_type`,`notifiable_id`);--> statement-breakpoint
CREATE INDEX `oauth_access_tokens_user_id_index` ON `oauth_access_tokens` (`user_id`);--> statement-breakpoint
CREATE INDEX `oauth_auth_codes_user_id_index` ON `oauth_auth_codes` (`user_id`);--> statement-breakpoint
CREATE INDEX `oauth_clients_user_id_index` ON `oauth_clients` (`user_id`);--> statement-breakpoint
CREATE INDEX `oauth_refresh_tokens_access_token_id_index` ON `oauth_refresh_tokens` (`access_token_id`);--> statement-breakpoint
CREATE INDEX `full` ON `users` (`name`);--> statement-breakpoint
ALTER TABLE `addresses` ADD CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `campaign_action_rewards` ADD CONSTRAINT `campaign_action_rewards_action_id_foreign` FOREIGN KEY (`action_id`) REFERENCES `actions`(`id`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `campaign_action_rewards` ADD CONSTRAINT `campaign_action_rewards_campaign_id_foreign` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns`(`id`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `campaign_action_rewards` ADD CONSTRAINT `campaign_action_rewards_reward_id_foreign` FOREIGN KEY (`reward_id`) REFERENCES `rewards`(`id`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `package_rewards` ADD CONSTRAINT `package_rewards_package_id_foreign` FOREIGN KEY (`package_id`) REFERENCES `packages`(`id`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `package_rewards` ADD CONSTRAINT `package_rewards_reward_id_foreign` FOREIGN KEY (`reward_id`) REFERENCES `rewards`(`id`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_salesperson_id_foreign` FOREIGN KEY (`salesperson_id`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_status_updated_by_foreign` FOREIGN KEY (`status_updated_by`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_transaction_item_id_foreign` FOREIGN KEY (`transaction_item_id`) REFERENCES `transaction_items`(`id`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `transaction_items` ADD CONSTRAINT `transaction_items_action_id_foreign` FOREIGN KEY (`action_id`) REFERENCES `actions`(`id`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `transaction_items` ADD CONSTRAINT `transaction_items_campaign_id_foreign` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns`(`id`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `transaction_items` ADD CONSTRAINT `transaction_items_reward_id_foreign` FOREIGN KEY (`reward_id`) REFERENCES `user_rewards`(`id`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_user_type_id_foreign` FOREIGN KEY (`user_type_id`) REFERENCES `user_types`(`id`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `user_infos` ADD CONSTRAINT `user_infos_package_id_foreign` FOREIGN KEY (`package_id`) REFERENCES `packages`(`id`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `user_infos` ADD CONSTRAINT `user_infos_salesperson_id_foreign` FOREIGN KEY (`salesperson_id`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `user_infos` ADD CONSTRAINT `user_infos_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `user_rewards` ADD CONSTRAINT `user_rewards_reward_id_foreign` FOREIGN KEY (`reward_id`) REFERENCES `rewards`(`id`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `user_rewards` ADD CONSTRAINT `user_rewards_transaction_item_id_foreign` FOREIGN KEY (`transaction_item_id`) REFERENCES `transaction_items`(`id`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `user_rewards` ADD CONSTRAINT `user_rewards_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `user_vehicles` ADD CONSTRAINT `user_vehicles_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE restrict;
*/