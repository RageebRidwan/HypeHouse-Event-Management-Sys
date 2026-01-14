import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
  timeout: 60000,
});

async function testCloudinary() {
  console.log('🔍 Testing Cloudinary Configuration...\n');

  // Check credentials
  console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
  console.log('API Key:', process.env.CLOUDINARY_API_KEY?.substring(0, 6) + '...');
  console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? '✓ Set' : '✗ Not set');
  console.log('');

  try {
    // Test 1: Ping Cloudinary API
    console.log('📡 Test 1: Pinging Cloudinary API...');
    const pingResult = await cloudinary.api.ping();
    console.log('✅ Ping successful:', pingResult.status);
    console.log('');

    // Test 2: Upload a small test image
    console.log('📤 Test 2: Uploading test image...');

    // Create a minimal 1x1 pixel PNG
    const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const testImageBuffer = Buffer.from(testImageBase64, 'base64');

    const uploadResult = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'hypehouse/test',
          resource_type: 'image',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(testImageBuffer);
    });

    console.log('✅ Upload successful!');
    console.log('URL:', uploadResult.secure_url);
    console.log('Public ID:', uploadResult.public_id);
    console.log('');

    // Test 3: Delete test image
    console.log('🗑️  Test 3: Cleaning up test image...');
    await cloudinary.uploader.destroy(uploadResult.public_id);
    console.log('✅ Cleanup successful');
    console.log('');

    console.log('✅ All tests passed! Cloudinary is working correctly.');
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  }
}

testCloudinary();
