# Primary Quest — TappyToe

A playful, mobile-friendly revision prototype for Singapore Primary 3–5 learners. The first playable mission is **Maths Market**, with original practice questions, worked explanations, stars, and locally saved progress.

## Live site

After enabling GitHub Pages and the first successful Actions deployment, the project site should be available at:

https://tappytoe.github.io/sg-primary-exam/

## Included in this prototype

- Primary 3, 4 and 5 level selection
- Maths multiple-choice missions, with original practice questions
- Answer feedback and short worked explanations
- Star count, question attempts and correct-answer count
- Local progress saved in the current browser/device
- Responsive layout and keyboard-friendly controls
- GitHub Actions deployment to GitHub Pages

Science, English and Mother Tongue cards are previews for future modules.

## Publish

1. Open **Settings → Pages** in this repository.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. The workflow in `.github/workflows/deploy.yml` publishes the site on each push to `main`.
4. Check the **Actions** tab for the deployment result.

## Curriculum note

This is an independent learning prototype, not an MOE product and not affiliated with the Ministry of Education. Questions are original practice items, not official exam questions. Topics should be checked against the latest MOE syllabus and reviewed by educators before being presented as full syllabus coverage. Schools may use different assessment formats and weightings.

## Technical notes

This is a static website built with HTML, CSS and vanilla JavaScript, so it does not need a build step or paid hosting. Progress is stored only in the learner's browser using `localStorage`; it does not sync between devices and clearing browser data may remove it. No student account is required.
