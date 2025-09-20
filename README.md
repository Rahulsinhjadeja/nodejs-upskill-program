# Node.js Student Management System

A comprehensive Node.js REST API for student management with authentication, file uploads, and advanced features like pagination and search.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Password Hashing**: Bcrypt
- **Validation**: Express-validator
- **Environment**: env-cmd

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nodejs-upskill-program
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Update `config/dev.env`:
   ```env
   PORT
   JWT_SECRET
   MONGODB_CONN_URL
   BCRYPT_SALT_ROUNDS
   ```

4. **Create required directories**
   ```bash
   mkdir -p public/images
   ```

## Running the Application

- **Development**: `npm run dev`
- **Production**: `npm run production`
- **Testing**: `npm test`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new student
- `POST /api/auth/login` - Student login

### Students (Protected Routes)
- `GET /api/students` - Get all students (with pagination & search)
- `GET /api/students/:id` - Get student by ID
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

## Some API Examples

### 1. Register Student
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: multipart/form-data" \
  -F "name=John Doe" \
  -F "email=john@example.com" \
  -F "password=Password123!" \
  -F "phone_number=1234567890" \
  -F "gender=male" \
  -F "enrollment_number=ENR2025ABCD" \
  -F "branch=cse" \
  -F "semester=3" \
  -F "profile_image=@/path/to/image.jpg"
```

### 2. Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"Password123!"}'
```

### 3. Update Student
```bash
curl -X PUT http://localhost:3001/api/students/STUDENT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: multipart/form-data" \
  -F "name=John Updated" \
  -F "profile_image=@/path/to/new-image.jpg"
```

## Student Schema

```javascript
{
  name: String (required, alphanumeric + spaces),
  email: String (required, unique, validated),
  password: String (required, strong password, hashed),
  phone_number: String (required, 10 digits),
  gender: String (required, enum: male/female/other),
  enrollment_number: String (required, unique, format: ENR2025XXXX),
  branch: String (required, enum: cse/ece/me/ce/ee/other),
  semester: Number (required, 1-12),
  address: String (optional, max 255 chars),
  profile_image: String (optional, image file path),
  tokens: Array (JWT tokens for multi-device login),
  created_at: Date,
  updated_at: Date
}
```

## Validation Rules

- **Name**: Alphanumeric characters and spaces only
- **Email**: Valid email format, unique
- **Password**: Minimum 8 characters, 1 uppercase, 1 lowercase, 1 symbol
- **Phone**: Exactly 10 digits
- **Enrollment Number**: Format ENR2025XXXX (4 alphanumeric uppercase)
- **Profile Image**: JPG, JPEG, PNG, GIF, WEBP (max 5MB)

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `JWT_SECRET` | JWT signing secret | `your_secret_key` |
| `MONGODB_CONN_URL` | MongoDB connection string | `mongodb_url` |
| `BCRYPT_SALT_ROUNDS` | Bcrypt salt rounds | `10` |

## File Upload

- **Destination**: `public/images/`
- **Cleanup**: Old images automatically deleted on update

## Pagination & Search

```bash
# Pagination
GET /api/students?page=2&limit=10

# Search by name or email
GET /api/students?search=john

# Combined
GET /api/students?page=1&limit=5&search=doe
```
## License

ISC License - see package.json for details.

## Author

Rahulsinh Jadeja