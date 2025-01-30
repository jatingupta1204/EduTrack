/*
  Warnings:

  - The values [NotActive] on the enum `StudentStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `academicYearId` on the `Batch` table. All the data in the column will be lost.
  - You are about to drop the column `startSemester` on the `Batch` table. All the data in the column will be lost.
  - You are about to drop the column `updated_At` on the `Department` table. All the data in the column will be lost.
  - You are about to drop the column `courseOfferingId` on the `Enrollment` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Enrollment` table. All the data in the column will be lost.
  - The `status` column on the `Enrollment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `gradeBy` on the `Grade` table. All the data in the column will be lost.
  - You are about to drop the column `academicYearId` on the `Semester` table. All the data in the column will be lost.
  - You are about to drop the column `employeeId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `fullname` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `User` table. All the data in the column will be lost.
  - The `admissionYear` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `AcademicYear` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CourseOffering` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Batch` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `Department` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `School` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[number]` on the table `Semester` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `schedule_info` to the `Batch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `semesterId` to the `Batch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `credits` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lecture_classes` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `practical_classes` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tutorial_classes` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Department` table without a default value. This is not possible if the table is not empty.
  - Added the required column `courseId` to the `Enrollment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentId` to the `Enrollment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacherId` to the `Enrollment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gradedById` to the `Grade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `academicYear` to the `Semester` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('Enrolled', 'Completed', 'Dropped');

-- AlterEnum
BEGIN;
CREATE TYPE "StudentStatus_new" AS ENUM ('Active', 'Inactive', 'Graduated', 'Suspended');
ALTER TABLE "User" ALTER COLUMN "status" TYPE "StudentStatus_new" USING ("status"::text::"StudentStatus_new");
ALTER TYPE "StudentStatus" RENAME TO "StudentStatus_old";
ALTER TYPE "StudentStatus_new" RENAME TO "StudentStatus";
DROP TYPE "StudentStatus_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_enrollmentId_fkey";

-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_markedById_fkey";

-- DropForeignKey
ALTER TABLE "Batch" DROP CONSTRAINT "Batch_academicYearId_fkey";

-- DropForeignKey
ALTER TABLE "Batch" DROP CONSTRAINT "Batch_coordinatorId_fkey";

-- DropForeignKey
ALTER TABLE "Batch" DROP CONSTRAINT "Batch_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "CourseOffering" DROP CONSTRAINT "CourseOffering_batchId_fkey";

-- DropForeignKey
ALTER TABLE "CourseOffering" DROP CONSTRAINT "CourseOffering_courseId_fkey";

-- DropForeignKey
ALTER TABLE "CourseOffering" DROP CONSTRAINT "CourseOffering_semesterId_fkey";

-- DropForeignKey
ALTER TABLE "CourseOffering" DROP CONSTRAINT "CourseOffering_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "Department" DROP CONSTRAINT "Department_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_courseOfferingId_fkey";

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_semesterId_fkey";

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Grade" DROP CONSTRAINT "Grade_enrollmentId_fkey";

-- DropForeignKey
ALTER TABLE "Grade" DROP CONSTRAINT "Grade_gradeBy_fkey";

-- DropForeignKey
ALTER TABLE "Semester" DROP CONSTRAINT "Semester_academicYearId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_departmentId_fkey";

-- DropIndex
DROP INDEX "Enrollment_userId_key";

-- AlterTable
ALTER TABLE "Batch" DROP COLUMN "academicYearId",
DROP COLUMN "startSemester",
ADD COLUMN     "schedule_info" JSONB NOT NULL,
ADD COLUMN     "semesterId" TEXT NOT NULL,
ALTER COLUMN "capacity" SET DEFAULT 50;

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "credits" INTEGER NOT NULL,
ADD COLUMN     "lecture_classes" INTEGER NOT NULL,
ADD COLUMN     "practical_classes" INTEGER NOT NULL,
ADD COLUMN     "tutorial_classes" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Department" DROP COLUMN "updated_At",
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Enrollment" DROP COLUMN "courseOfferingId",
DROP COLUMN "userId",
ADD COLUMN     "courseId" TEXT NOT NULL,
ADD COLUMN     "studentId" TEXT NOT NULL,
ADD COLUMN     "teacherId" TEXT NOT NULL,
ALTER COLUMN "enrollmentDate" SET DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "status",
ADD COLUMN     "status" "EnrollmentStatus" NOT NULL DEFAULT 'Enrolled';

-- AlterTable
ALTER TABLE "Grade" DROP COLUMN "gradeBy",
ADD COLUMN     "gradedById" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Semester" DROP COLUMN "academicYearId",
ADD COLUMN     "academicYear" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "employeeId",
DROP COLUMN "fullname",
DROP COLUMN "studentId",
ADD COLUMN     "batchId" TEXT,
ADD COLUMN     "first_name" TEXT,
ADD COLUMN     "last_name" TEXT,
ALTER COLUMN "avatar" DROP NOT NULL,
ALTER COLUMN "role" DROP DEFAULT,
DROP COLUMN "admissionYear",
ADD COLUMN     "admissionYear" INTEGER,
ALTER COLUMN "currentSemester" DROP NOT NULL,
ALTER COLUMN "departmentId" DROP NOT NULL;

-- DropTable
DROP TABLE "AcademicYear";

-- DropTable
DROP TABLE "CourseOffering";

-- DropEnum
DROP TYPE "CourseOfferingStauts";

-- DropEnum
DROP TYPE "Status";

-- CreateIndex
CREATE UNIQUE INDEX "Batch_name_key" ON "Batch"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Department_code_key" ON "Department"("code");

-- CreateIndex
CREATE UNIQUE INDEX "School_code_key" ON "School"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Semester_number_key" ON "Semester"("number");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_gradedById_fkey" FOREIGN KEY ("gradedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_markedById_fkey" FOREIGN KEY ("markedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Batch" ADD CONSTRAINT "Batch_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Batch" ADD CONSTRAINT "Batch_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Batch" ADD CONSTRAINT "Batch_coordinatorId_fkey" FOREIGN KEY ("coordinatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
