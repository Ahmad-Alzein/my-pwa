# GitHub Pages PWA Setup

This guide explains how to put this static PWA folder online with GitHub Pages. No server setup is needed.

## 1. Create a GitHub Repository

1. Go to <https://github.com>.
2. Sign in or create an account.
3. Click **New repository**.
4. Choose a short repository name, such as `my-pwa`.
5. Set the repository to **Public**.
6. Click **Create repository**.

## 2. Upload the App Files

You can upload the files in either of these ways.

### Option A: Upload in the Browser

1. Open the new repository on GitHub.
2. Click **Add file**.
3. Click **Upload files**.
4. Drag all files and folders from this PWA folder into the upload area.
5. Click **Commit changes**.

### Option B: Push with Git

If someone is helping you with Git, they can run commands like these from this folder:

```bash
git init
git add .
git commit -m "Add PWA files"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Replace `YOUR-USERNAME` and `YOUR-REPOSITORY` with your GitHub username and repository name.

## 3. Turn On GitHub Pages

1. Open the repository on GitHub.
2. Click **Settings**.
3. In the left menu, click **Pages**.
4. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
5. Under **Branch**, choose `main`.
6. Choose `/root` if GitHub asks for a folder.
7. Click **Save**.

GitHub may take a few minutes to publish the site.

## 4. Open the Published Site

The site URL usually looks like this:

```text
https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/
```

For example, if your username is `alex` and your repository is `my-pwa`, the URL would be:

```text
https://alex.github.io/my-pwa/
```

## 5. Change the Link

You have two practical options.

### Option A: Change the repository name

This changes the last part of the free GitHub Pages URL.

For example, a repository named `life-os` gives you:

```text
https://YOUR-USERNAME.github.io/life-os/
```

A repository named `ahmad-life-os` gives you:

```text
https://YOUR-USERNAME.github.io/ahmad-life-os/
```

This is the easiest option and does not require buying a domain.

### Option B: Use your own domain or subdomain

If you own a domain, you can use something like:

```text
https://lifeos.yourdomain.com/
```

To do that:

1. Open the repository on GitHub.
2. Go to **Settings**.
3. Go to **Pages**.
4. Under **Custom domain**, enter your domain or subdomain.
5. Save it.
6. In your domain provider's DNS settings, add the DNS record GitHub asks for.
7. Wait for GitHub to confirm the domain.
8. Turn on **Enforce HTTPS** when it becomes available.

You cannot use the exact same GitHub Pages URL or custom domain for two different apps. If another app already uses it, choose a different repository name, a different subdomain, or a different domain.

## 6. Add the PWA to an iPhone Home Screen

1. Open the published GitHub Pages URL in **Safari** on the iPhone.
2. Tap the **Share** button.
3. Scroll down and tap **Add to Home Screen**.
4. Confirm the name.
5. Tap **Add**.

The app icon will appear on the iPhone Home Screen.

## Data and Privacy Notes

- This app stores its data in Safari on the device, usually through `localStorage`.
- Data is not automatically sent to GitHub Pages just because the app is hosted there.
- If Safari website data is cleared, the app data may be deleted.
- Data saved on one iPhone will not automatically appear on another device unless the app has a separate sync feature.
- Opening the app from a different browser, private browsing mode, or a different GitHub Pages URL may show different saved data.
