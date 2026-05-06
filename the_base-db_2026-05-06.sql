-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: May 06, 2026 at 09:51 AM
-- Server version: 8.2.0
-- PHP Version: 8.3.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `the_base`
--

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int UNSIGNED NOT NULL,
  `user_id` int UNSIGNED NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `type` enum('win','loss','bonus') COLLATE utf8mb4_unicode_ci NOT NULL,
  `game` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `user_id`, `amount`, `type`, `game`, `created_at`) VALUES
(1, 16, 0.00, 'win', 'Console', '2026-04-22 08:51:16'),
(2, 16, 10.00, 'loss', 'wheelspin', '2026-04-22 08:51:19'),
(3, 16, 10.00, 'loss', 'wheelspin', '2026-04-22 08:51:42'),
(4, 16, 50.00, 'win', 'wheelspin', '2026-04-22 08:51:58'),
(5, 16, 10.00, 'loss', 'wheelspin', '2026-04-22 08:56:01'),
(6, 16, 50.00, 'win', 'wheelspin', '2026-04-22 08:56:16'),
(7, 16, 50.00, 'loss', 'slots', '2026-04-22 09:04:37'),
(8, 16, 50.00, 'loss', 'slots', '2026-04-22 09:04:47'),
(9, 16, 50.00, 'loss', 'slots', '2026-04-22 09:05:03'),
(10, 16, 10.00, 'loss', 'slots', '2026-04-22 09:06:22'),
(11, 16, 20.00, 'loss', 'slots', '2026-04-22 09:06:31'),
(12, 16, 20.00, 'loss', 'slots', '2026-04-22 09:06:39'),
(13, 16, 20.00, 'loss', 'slots', '2026-04-22 09:06:47'),
(14, 16, 20.00, 'loss', 'slots', '2026-04-22 09:06:57'),
(15, 16, 20.00, 'loss', 'slots', '2026-04-22 09:07:05'),
(16, 16, 5.00, 'loss', 'slots', '2026-04-22 09:07:15'),
(17, 16, 5.00, 'loss', 'slots', '2026-04-22 09:07:23'),
(18, 16, 5.00, 'loss', 'slots', '2026-04-22 09:07:33'),
(19, 16, 25.00, 'win', 'slots', '2026-04-22 09:07:36'),
(20, 16, 50.00, 'loss', 'slots', '2026-04-22 09:07:45'),
(21, 16, 50.00, 'loss', 'slots', '2026-04-22 09:08:03'),
(22, 16, 50.00, 'loss', 'slots', '2026-04-22 09:08:14'),
(23, 16, 50.00, 'loss', 'slots', '2026-04-22 09:08:24'),
(24, 16, 10.00, 'loss', 'wheelspin', '2026-04-22 09:08:59'),
(25, 16, 10.00, 'loss', 'wheelspin', '2026-04-22 09:09:21'),
(26, 16, 10.00, 'loss', 'wheelspin', '2026-04-22 09:09:41'),
(27, 16, 150.00, 'win', 'wheelspin', '2026-04-22 09:09:57'),
(28, 16, 10.00, 'loss', 'wheelspin', '2026-04-22 09:10:03'),
(29, 16, 100.00, 'win', 'wheelspin', '2026-04-22 09:10:19'),
(30, 16, 10.00, 'loss', 'wheelspin', '2026-04-22 09:10:30'),
(31, 16, 500.00, 'win', 'wheelspin', '2026-04-22 09:10:46'),
(32, 16, 50.00, 'loss', 'slots', '2026-04-22 09:13:39'),
(33, 16, 50.00, 'loss', 'slots', '2026-04-22 09:13:58'),
(34, 16, 50.00, 'loss', 'slots', '2026-04-22 09:14:08'),
(35, 16, 50.00, 'loss', 'slots', '2026-04-22 09:14:18'),
(36, 16, 50.00, 'loss', 'slots', '2026-04-22 09:14:26'),
(37, 16, 10.00, 'loss', 'wheelspin', '2026-04-29 08:08:34'),
(38, 16, 200.00, 'win', 'wheelspin', '2026-04-29 08:08:50'),
(39, 16, 10.00, 'loss', 'wheelspin', '2026-04-29 08:08:57'),
(40, 16, 100.00, 'win', 'wheelspin', '2026-04-29 08:09:13'),
(41, 16, 10.00, 'loss', 'wheelspin', '2026-04-29 08:39:09'),
(42, 16, 1000.00, 'win', 'wheelspin', '2026-04-29 08:39:24'),
(43, 16, 10.00, 'loss', 'wheelspin', '2026-04-29 08:39:46'),
(44, 16, 150.00, 'win', 'wheelspin', '2026-04-29 08:40:02'),
(45, 16, 50.00, 'loss', 'slots', '2026-04-29 08:40:33'),
(46, 16, 69.00, 'bonus', 'deposit', '2026-04-29 08:54:58'),
(47, 16, 1.00, 'bonus', 'deposit', '2026-04-29 08:55:21'),
(48, 16, 50.00, 'loss', 'slots', '2026-04-29 09:02:24'),
(49, 16, 50.00, 'loss', 'slots', '2026-04-29 09:02:31'),
(50, 16, 50.00, 'loss', 'slots', '2026-04-29 09:02:39'),
(51, 16, 50.00, 'loss', 'slots', '2026-04-29 09:02:49'),
(52, 16, 50.00, 'loss', 'slots', '2026-04-29 09:03:00'),
(53, 17, 9999.00, 'bonus', 'deposit', '2026-05-06 08:40:39'),
(54, 17, 10.00, 'loss', 'wheelspin', '2026-05-06 08:40:52'),
(55, 17, 100.00, 'win', 'wheelspin', '2026-05-06 08:41:08'),
(56, 17, 10.00, 'loss', 'wheelspin', '2026-05-06 08:41:14'),
(57, 17, 100.00, 'win', 'wheelspin', '2026-05-06 08:41:30'),
(58, 17, 10.00, 'loss', 'wheelspin', '2026-05-06 08:41:37'),
(59, 17, 150.00, 'win', 'wheelspin', '2026-05-06 08:41:52'),
(60, 17, 10.00, 'loss', 'wheelspin', '2026-05-06 08:41:59'),
(61, 17, 100.00, 'win', 'wheelspin', '2026-05-06 08:42:14'),
(62, 17, 10.00, 'loss', 'wheelspin', '2026-05-06 08:42:21'),
(63, 17, 200.00, 'win', 'wheelspin', '2026-05-06 08:42:37'),
(64, 17, 10.00, 'loss', 'wheelspin', '2026-05-06 08:42:43'),
(65, 17, 500.00, 'win', 'wheelspin', '2026-05-06 08:42:59'),
(66, 17, 10.00, 'loss', 'wheelspin', '2026-05-06 08:43:07'),
(67, 17, 50.00, 'win', 'wheelspin', '2026-05-06 08:43:22'),
(68, 17, 10.00, 'loss', 'wheelspin', '2026-05-06 08:43:29'),
(69, 17, 150.00, 'win', 'wheelspin', '2026-05-06 08:43:44'),
(70, 17, 10.00, 'loss', 'wheelspin', '2026-05-06 08:43:51'),
(71, 17, 500.00, 'win', 'wheelspin', '2026-05-06 08:44:09'),
(72, 17, 10.00, 'loss', 'wheelspin', '2026-05-06 08:44:15'),
(73, 17, 10.00, 'loss', 'wheelspin', '2026-05-06 08:44:39'),
(74, 17, 1000.00, 'win', 'wheelspin', '2026-05-06 08:44:54'),
(75, 17, 50.00, 'loss', 'slots', '2026-05-06 08:45:18'),
(76, 17, 50.00, 'loss', 'slots', '2026-05-06 08:45:33'),
(77, 17, 50.00, 'loss', 'slots', '2026-05-06 08:45:33'),
(78, 17, 50.00, 'loss', 'slots', '2026-05-06 08:45:41'),
(79, 17, 50.00, 'loss', 'slots', '2026-05-06 08:45:43'),
(80, 17, 50.00, 'loss', 'slots', '2026-05-06 08:46:03'),
(81, 17, 50.00, 'loss', 'slots', '2026-05-06 08:46:11'),
(82, 17, 50.00, 'loss', 'slots', '2026-05-06 08:46:19');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int UNSIGNED NOT NULL,
  `last_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `balance` decimal(10,2) DEFAULT '0.00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `last_name`, `first_name`, `email`, `password_hash`, `created_at`, `balance`) VALUES
(1, 'Max', 'Michel', 'michel.max@education.lu', '', '2026-02-04 09:47:42', 0.00),
(16, 'Ambrosini', 'Hector', 'AmbHe393@school.lu', '$2b$12$hKT6MZlD20g9XaqtoHtr0u2g3GTYDnIXisGiy55cpKZWtrx8PS06y', '2026-04-22 08:22:01', 1640.00),
(17, 'nigga', 'john', 'niggagames@gmail.com', '$2b$12$bIUIlp7Dj47Aaizy6yipFe4K4BFPjaUCt4x/9f1t7BfcnSeR5U/Ye', '2026-05-06 08:39:34', 12299.00);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=83;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
