$(document).ready(function() {
	var upload_file, name, download_file, numberOfFiles;
	$('h3[name="name"]').each(function() {
			name = $(this).text();
			console.log(name);
	});

	$('h3[name="numberOfFiles"]').each(function() {
		numberOfFiles = $(this).text();
		console.log(numberOfFiles);
	});
	
	$("#btn-upload").click(function() {
		$('input[name="upload_file"]').each(function() {
			upload_file = $(this).val();
			upload_file = upload_file.split('\\');
			upload_file = upload_file[2];
			console.log(upload_file);
		});

		$.post("/upload", {upload_file : upload_file, name: name }).done(function(data) {
			console.log(data);
			if(data == "OK") {
				alert("file successfully uploaded");
			}
		});
	});

	$("#logout").click(function() {
		console.log("in logout");
		window.location.href = '/';
	});
});