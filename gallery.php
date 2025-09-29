<?php
// gallery.php
header('Content-Type: application/json');

// Directory where uploaded images are stored
$uploadDir = 'uploads/';
$staticImages = [
    [
        'id' => 1,
        'title' => 'Rhode Island Red Chickens',
        'description' => 'Beautiful heritage breed chickens roaming freely',
        'filename' => 'image1.jpg'
    ],
    [
        'id' => 2,
        'title' => 'Free-range Heritage Breeds',
        'description' => 'Chickens exhibiting natural behaviors in our pastures',
        'filename' => 'image2.jpg'
    ],
    [
        'id' => 3,
        'title' => 'Our Sustainable Farm',
        'description' => 'View of our farm with chickens in natural habitat',
        'filename' => 'image3.jpg'
    ],
    [
        'id' => 4,
        'title' => 'Chicken Coops',
        'description' => 'Our well-maintained housing for the chickens',
        'filename' => 'image4.jpg'
    ],
    [
        'id' => 5,
        'title' => 'Farm Landscape',
        'description' => 'Scenic view of our poultry farm',
        'filename' => 'image5.jpg'
    ]
];

// Check if uploads directory exists
if (is_dir($uploadDir)) {
    // Get all uploaded images
    $uploadedImages = [];
    $files = scandir($uploadDir);
    
    // Filter out . and .. directories
    $imageFiles = array_filter($files, function($file) use ($uploadDir) {
        return is_file($uploadDir . $file) && 
               in_array(pathinfo($uploadDir . $file, PATHINFO_EXTENSION), ['jpg', 'jpeg', 'png', 'gif']);
    });
    
    // Add uploaded images to the array
    $id = 6; // Start after static images
    foreach ($imageFiles as $file) {
        $uploadedImages[] = [
            'id' => $id++,
            'title' => 'Uploaded Image',
            'description' => 'Image uploaded to gallery',
            'filename' => $uploadDir . $file
        ];
    }
    
    // Combine static and uploaded images
    $allImages = array_merge($staticImages, $uploadedImages);
} else {
    // If uploads directory doesn't exist, just use static images
    $allImages = $staticImages;
}

echo json_encode([
    'success' => true,
    'data' => $allImages
]);
?>