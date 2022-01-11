## Ticket link (optional)
Resolves [HD-1234](https://example.com)

## Description
This will fix a bug when uploading image on screen xyz.

## Test Plan (required)
<!-- Prove that the code works, attach screenshots, screen recording, anything that will prove it is safe to merge. 

- Happy path
- Error handling (uploading invalid file, uploading when offline, …)
- Existing functionality still works
-->
Example:
I uninstalled the existing app on simulator then rebuild a new one. Saw no errors.

I tried uploading 2 images with the allowed size, it works perfectly.

I tried uploading an image that exceeds the allowed size, saw a correct error message.

Tried a few times and it behaves as expected.
