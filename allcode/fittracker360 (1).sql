-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 23, 2024 at 12:41 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `fittracker360`
--

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `UserId` INT AUTO_INCREMENT PRIMARY KEY,
  `UserName` VARCHAR(50) NOT NULL,
  `UserEmail` VARCHAR(50) NOT NULL,
  `UserHeight` INT NOT NULL,
  `UserWeight` INT NOT NULL,
  `UserDateOfBirth` DATE NOT NULL,
  `UserPassword` VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Insert sample data for the table `user`
INSERT INTO `user` (`UserName`, `UserEmail`, `UserHeight`, `UserWeight`, `UserDateOfBirth`, `UserPassword`) VALUES
('Rahim Ali', 'rahim@example.com', 175, 70, '1990-05-15', 'password1'),
('Fatima Khan', 'fatima@example.com', 160, 55, '1995-09-20', 'password2'),
('Arjun Patel', 'arjun@example.com', 170, 75, '1988-03-10', 'password3'),
('Priya Sharma', 'priya@example.com', 155, 50, '1998-12-28', 'password4'),
('Sohel Rahman', 'sohel@example.com', 180, 85, '1992-11-18', 'password5');

-- Table structure for table `food`
CREATE TABLE `food` (
  `FoodId` INT AUTO_INCREMENT PRIMARY KEY,
  `FoodName` VARCHAR(50) NOT NULL,
  `Quantity` VARCHAR(20) NOT NULL,
  `Calorie` INT NOT NULL
);

-- Insert sample data for the Food table
INSERT INTO `food` (`FoodName`, `Quantity`, `Calorie`) VALUES
('Biryani', '1 plate', 650),
('Chow Mein', '1 serving', 400),
('Masala Dosa', '1 piece', 300),
('Pakora', '1 piece', 100),
('Pani Puri', '1 plate', 180),
('Samosa', '1 piece', 150),
('Thukpa', '1 serving', 250),
('Vada Pav', '1 piece', 300),
('Rasgulla', '1 piece', 150),
('Gulab Jamun', '1 piece', 250),
('Mutton Curry', '1 serving', 400),
('Paneer Tikka', '1 serving', 350),
('Palak Paneer', '1 serving', 300),
('Butter Chicken', '1 serving', 450),
('Tandoori Roti', '1 piece', 150),
('Naan', '1 piece', 200),
('Poha', '1 serving', 250),
('Idli', '1 piece', 50),
('Paratha', '1 piece', 300),
('Lassi', '1 glass', 200);

-- Table structure for table `exercise`
CREATE TABLE `exercise` (
  `ExerciseId` INT AUTO_INCREMENT PRIMARY KEY,
  `ExerciseName` VARCHAR(50) NOT NULL,
  `Duration` INT NOT NULL,
  `CalorieIntake` INT NOT NULL
);

-- Insert sample data for the Exercise table
INSERT INTO `exercise` (`ExerciseName`, `Duration`, `CalorieIntake`) VALUES
('Running', 30, 300),
('Walking', 30, 150),
('Swimming', 60, 450),
('Weight Lifting', 45, 350),
('Jump Rope', 30, 250),
('Hiking', 120, 600),
('Dancing', 60, 350),
('Yoga', 60, 200),
('Cycling', 45, 250),
('Aerobics', 60, 300),
('Cricket', 120, 400),
('Badminton', 60, 250),
('Football', 90, 500),
('Basketball', 60, 300);

-- Table structure for table `doctor`
CREATE TABLE `doctor` (
  `DoctorId` INT AUTO_INCREMENT PRIMARY KEY,
  `DoctorName` VARCHAR(50) NOT NULL,
  `Specialization` VARCHAR(50) NOT NULL,
  `Date` DATE NOT NULL,
  `email` VARCHAR(50) NOT NULL
);

-- Insert sample data for the Doctor table
INSERT INTO `doctor` (`DoctorName`, `Specialization`, `Date`, `email`) VALUES
('Dr. Rahman', 'Cardiology', '2024-03-01', 'rahman@example.com'),
('Dr. Smith', 'Cardiology', '2024-03-01', 'smith@example.com'),
('Dr. Rodriguez', 'Endocrinology', '2024-02-10', 'rodriguez@example.com'),
('Dr. Martinez', 'Psychiatry', '2024-03-05', 'martinez@example.com'),
('Dr. Ali', 'Orthopedics', '2024-02-15', 'ali@example.com'),
('Dr. Singh', 'Dermatology', '2024-02-20', 'singh@example.com'),
('Dr. Khan', 'Pediatrics', '2024-03-10', 'khan@example.com'),
('Dr. Patel', 'Oncology', '2024-01-25', 'patel@example.com');

-- Table structure for table `fitness_trainer`
CREATE TABLE `fitness_trainer` (
  `TrainerId` INT AUTO_INCREMENT PRIMARY KEY,
  `TrainerName` VARCHAR(50) NOT NULL,
  `Specialization` VARCHAR(50) NOT NULL,
  `Email` VARCHAR(50) NOT NULL
);

-- Insert sample data for the Fitness Trainer table
INSERT INTO `fitness_trainer` (`TrainerName`, `Specialization`, `Email`) VALUES
('Trainer Ahmed', 'Strength Training', 'ahmed@fitnesstrainer.com'),
('Trainer Gupta', 'Yoga Instructor', 'gupta@fitnesstrainer.com'),
('Trainer Khan', 'CrossFit Coach', 'khan@fitnesstrainer.com'),
('Trainer Rao', 'Pilates Instructor', 'rao@fitnesstrainer.com'),
('Trainer Mishra', 'Cardiovascular Conditioning', 'mishra@fitnesstrainer.com');


CREATE TABLE `forum_posts` (
  `post_id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `post_title` VARCHAR(100) NOT NULL,
  `post_content` TEXT NOT NULL,
  `post_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `user` (`UserId`)
);


CREATE TABLE `forum_replies` (
  `reply_id` INT AUTO_INCREMENT PRIMARY KEY,
  `post_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `reply_content` TEXT NOT NULL,
  `reply_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`post_id`) REFERENCES `forum_posts` (`post_id`),
  FOREIGN KEY (`user_id`) REFERENCES `user` (`UserId`)
);


CREATE TABLE `blogs` (
  `blog_id` INT AUTO_INCREMENT PRIMARY KEY,
  `admin_id` INT NOT NULL,
  `blog_title` VARCHAR(100) NOT NULL,
  `blog_content` TEXT NOT NULL,
  `blog_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`admin_id`) REFERENCES `user` (`UserId`)
);
