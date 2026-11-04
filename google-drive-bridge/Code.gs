/**
 * GOOGLE APPS SCRIPT - GOOGLE DRIVE PHOTO FETCHER FOR LHPIC
 * 
 * HƯỚNG DẪN CÀI ĐẶT 100% MIỄN PHÍ TRONG 2 PHÚT:
 * 1. Mở https://script.google.com bằng tài khoản Google của bạn hoặc của CLB.
 * 2. Nhấn "Dự án mới" (New project) và dán toàn bộ đoạn code bên dưới vào.
 * 3. Nhấn "Triển khai" (Deploy) > "Tùy chọn triển khai mới" (New deployment).
 * 4. Mục "Chọn loại" chọn: "Ứng dụng web" (Web app).
 *    - Mô tả: LHPIC Drive Photo Bridge
 *    - Thực thi dưới dạng: Tôi (Me - email của bạn)
 *    - Ai có quyền truy cập: Bất kỳ ai (Anyone)
 * 5. Nhấn "Triển khai" và cấp quyền truy cập Google Drive khi được hỏi.
 * 6. Copy đường link URL Web App (dạng: https://script.google.com/macros/s/AKfycb.../exec).
 * 7. Dán link này vào mục Cấu hình Google Drive trong trang Admin CMS (/admin.html) hoặc cài đặt vào store.js!
 */

function doGet(e) {
  var folderId = e.parameter.folderId || e.parameter.id;
  var limit = parseInt(e.parameter.limit || 50, 10);

  if (!folderId) {
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: "Vui lòng cung cấp folderId của thư mục Google Drive (ví dụ: ?folderId=1abc...)" 
    })).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    var folder = DriveApp.getFolderById(folderId);
    var files = folder.getFiles();
    var photos = [];

    while (files.hasNext() && photos.length < limit) {
      var file = files.next();
      var mime = file.getMimeType();
      
      // Chỉ lấy các file định dạng hình ảnh (jpg, png, webp, heic, jpeg...)
      if (mime.indexOf('image/') !== -1) {
        var fileId = file.getId();
        photos.push({
          id: fileId,
          name: file.getName(),
          // Thumbnail tối ưu độ phân giải 800px để web tải cực mượt
          url: 'https://lh3.googleusercontent.com/d/' + fileId + '=w800',
          // Link ảnh gốc độ nét tối đa
          fullUrl: 'https://lh3.googleusercontent.com/d/' + fileId,
          caption: file.getName(),
          size: file.getSize(),
          dateCreated: file.getDateCreated()
        });
      }
    }

    var result = {
      success: true,
      folderId: folderId,
      folderName: folder.getName(),
      count: photos.length,
      photos: photos
    };

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
