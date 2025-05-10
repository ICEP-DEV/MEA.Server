-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 10, 2025 at 05:23 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mea_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `accommodation` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `check_in` date NOT NULL,
  `check_out` date NOT NULL,
  `guests` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `image` varchar(500) DEFAULT NULL,
  `rating` decimal(2,1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `user_id`, `accommodation`, `location`, `check_in`, `check_out`, `guests`, `price`, `image`, `rating`) VALUES
(6, 1, 'Grootbos Private Nature Reserve', 'Gansbaai, Western Cape', '2025-05-01', '2025-05-04', 2, 4500.00, '/placeholder.svg?height=300&width=500', 4.9),
(7, 2, 'Bushmans Kloof Wilderness Reserve', 'Clanwilliam, Western Cape', '2025-06-12', '2025-06-15', 2, 3900.00, '/placeholder2.svg?height=300&width=500', 4.8),
(8, 3, 'Thonga Beach Lodge', 'iSimangaliso Wetland Park, KwaZulu-Natal', '2025-07-03', '2025-07-06', 2, 5200.00, '/placeholder3.svg?height=300&width=500', 4.7),
(9, 1, 'Fugitives’ Drift Lodge', 'Rorke’s Drift, KwaZulu-Natal', '2025-08-20', '2025-08-23', 1, 3100.00, '/placeholder4.svg?height=300&width=500', 4.6),
(10, 2, 'Kagga Kamma Nature Reserve', 'Cederberg, Western Cape', '2025-09-10', '2025-09-12', 4, 6100.00, '/placeholder5.svg?height=300&width=500', 4.5);

-- --------------------------------------------------------

--
-- Table structure for table `daily_usage`
--

CREATE TABLE `daily_usage` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `water_usage` decimal(10,2) DEFAULT 0.00,
  `electric_usage` decimal(10,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `daily_usage`
--

INSERT INTO `daily_usage` (`id`, `user_id`, `date`, `water_usage`, `electric_usage`, `created_at`) VALUES
(1, 1, '2025-05-01', 20.00, 50.00, '2025-05-01 06:00:00'),
(2, 1, '2025-05-02', 18.00, 45.00, '2025-05-02 06:00:00'),
(3, 1, '2025-05-03', 22.00, 55.00, '2025-05-03 06:00:00'),
(4, 1, '2025-05-04', 19.00, 48.00, '2025-05-04 06:00:00'),
(5, 1, '2025-05-05', 21.00, 52.00, '2025-05-05 06:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `sustainability`
--

CREATE TABLE `sustainability` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `points` int(11) DEFAULT 0,
  `distance` decimal(10,2) DEFAULT 0.00,
  `travel_mode` varchar(50) NOT NULL,
  `accomodation_type` varchar(50) NOT NULL,
  `carbon_value` decimal(10,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sustainability`
--

INSERT INTO `sustainability` (`id`, `user_id`, `points`, `distance`, `travel_mode`, `accomodation_type`, `carbon_value`, `created_at`) VALUES
(1, 1, 50, 20.00, '', '', 3.50, '2025-05-01 06:00:00'),
(2, 1, 55, 18.00, '', '', 3.20, '2025-05-02 06:00:00'),
(3, 1, 45, 24.00, '', '', 4.00, '2025-05-03 06:00:00'),
(4, 1, 60, 17.00, '', '', 2.90, '2025-05-04 06:00:00'),
(5, 1, 65, 15.00, '', '', 2.70, '2025-05-05 06:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `created_at`) VALUES
(1, 'Lerato Mokoena', 'lerato@example.co.za', 'hashedpassword1', '2025-05-10 12:18:01'),
(2, 'Sipho Dlamini', 'sipho@example.co.za', 'hashedpassword2', '2025-05-10 12:18:01'),
(3, 'Thandi Nkosi', 'thandi@example.co.za', 'hashedpassword3', '2025-05-10 12:18:01');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `daily_usage`
--
ALTER TABLE `daily_usage`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `sustainability`
--
ALTER TABLE `sustainability`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `daily_usage`
--
ALTER TABLE `daily_usage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `sustainability`
--
ALTER TABLE `sustainability`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `daily_usage`
--
ALTER TABLE `daily_usage`
  ADD CONSTRAINT `daily_usage_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sustainability`
--
ALTER TABLE `sustainability`
  ADD CONSTRAINT `sustainability_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
