-- CreateTable
CREATE TABLE `codefolio_users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `username` VARCHAR(100) NOT NULL,
    `passwordHash` VARCHAR(255) NOT NULL,
    `resetToken` VARCHAR(255) NULL,
    `resetTokenExp` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `codefolio_users_email_key`(`email`),
    UNIQUE INDEX `codefolio_users_username_key`(`username`),
    INDEX `codefolio_users_username_idx`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `codefolio_profiles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `username` VARCHAR(100) NOT NULL,
    `displayName` VARCHAR(150) NOT NULL,
    `headline` VARCHAR(200) NULL,
    `bio` TEXT NULL,
    `location` VARCHAR(100) NULL,
    `profileImage` VARCHAR(500) NULL,
    `resumeUrl` VARCHAR(500) NULL,
    `templateId` INTEGER NULL,
    `themeMode` ENUM('LIGHT', 'DARK', 'SYSTEM') NOT NULL DEFAULT 'LIGHT',
    `accentColor` VARCHAR(7) NULL,
    `githubUsername` VARCHAR(100) NULL,
    `linkedinUrl` VARCHAR(500) NULL,
    `websiteUrl` VARCHAR(500) NULL,
    `status` ENUM('DRAFT', 'PUBLISHED') NOT NULL DEFAULT 'DRAFT',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `codefolio_profiles_userId_key`(`userId`),
    UNIQUE INDEX `codefolio_profiles_username_key`(`username`),
    INDEX `codefolio_profiles_userId_idx`(`userId`),
    INDEX `codefolio_profiles_username_idx`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `codefolio_templates` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `previewImage` VARCHAR(191) NULL,
    `isPremium` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `codefolio_templates_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `codefolio_projects` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `slug` VARCHAR(250) NOT NULL,
    `description` TEXT NULL,
    `techStack` VARCHAR(500) NULL,
    `repoUrl` VARCHAR(500) NULL,
    `liveUrl` VARCHAR(500) NULL,
    `screenshotUrl` VARCHAR(500) NULL,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `displayOrder` INTEGER NOT NULL DEFAULT 0,
    `problem` TEXT NULL,
    `solution` TEXT NULL,
    `impact` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `codefolio_projects_slug_key`(`slug`),
    INDEX `codefolio_projects_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `codefolio_skills` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `category` VARCHAR(100) NOT NULL,
    `proficiency` INTEGER NOT NULL DEFAULT 0,
    `displayOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `codefolio_skills_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `codefolio_social_links` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `platform` VARCHAR(100) NOT NULL,
    `url` VARCHAR(500) NOT NULL,
    `displayOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `codefolio_social_links_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `codefolio_portfolio_views` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `ipHash` VARCHAR(64) NOT NULL,
    `userAgent` VARCHAR(500) NULL,
    `referrer` VARCHAR(500) NULL,
    `viewedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `codefolio_portfolio_views_userId_idx`(`userId`),
    INDEX `codefolio_portfolio_views_viewedAt_idx`(`viewedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `codefolio_contact_messages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `senderName` VARCHAR(150) NOT NULL,
    `senderEmail` VARCHAR(255) NOT NULL,
    `subject` VARCHAR(200) NULL,
    `message` TEXT NOT NULL,
    `status` ENUM('UNREAD', 'READ', 'ARCHIVED') NOT NULL DEFAULT 'UNREAD',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `codefolio_contact_messages_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `codefolio_custom_domains` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `domain` VARCHAR(255) NOT NULL,
    `verificationStatus` ENUM('PENDING', 'VERIFIED', 'FAILED') NOT NULL DEFAULT 'PENDING',
    `cnameTarget` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `codefolio_custom_domains_domain_key`(`domain`),
    INDEX `codefolio_custom_domains_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `codefolio_subscriptions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `plan` ENUM('FREE', 'PRO') NOT NULL DEFAULT 'FREE',
    `status` ENUM('ACTIVE', 'CANCELED', 'EXPIRED') NOT NULL DEFAULT 'ACTIVE',
    `startedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiresAt` DATETIME(3) NULL,

    UNIQUE INDEX `codefolio_subscriptions_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `codefolio_version_snapshots` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `versionName` VARCHAR(100) NOT NULL DEFAULT 'Snapshot',
    `profileData` JSON NULL,
    `projectsData` JSON NULL,
    `skillsData` JSON NULL,
    `socialLinksData` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `codefolio_version_snapshots_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `codefolio_profiles` ADD CONSTRAINT `codefolio_profiles_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `codefolio_users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `codefolio_profiles` ADD CONSTRAINT `codefolio_profiles_templateId_fkey` FOREIGN KEY (`templateId`) REFERENCES `codefolio_templates`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `codefolio_projects` ADD CONSTRAINT `codefolio_projects_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `codefolio_users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `codefolio_skills` ADD CONSTRAINT `codefolio_skills_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `codefolio_users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `codefolio_social_links` ADD CONSTRAINT `codefolio_social_links_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `codefolio_users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `codefolio_portfolio_views` ADD CONSTRAINT `codefolio_portfolio_views_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `codefolio_users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `codefolio_contact_messages` ADD CONSTRAINT `codefolio_contact_messages_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `codefolio_users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `codefolio_custom_domains` ADD CONSTRAINT `codefolio_custom_domains_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `codefolio_users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `codefolio_subscriptions` ADD CONSTRAINT `codefolio_subscriptions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `codefolio_users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `codefolio_version_snapshots` ADD CONSTRAINT `codefolio_version_snapshots_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `codefolio_users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
