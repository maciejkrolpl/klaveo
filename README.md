# Клава

A simple one-page app that turns Latin letters into **Belarusian** or **Ukrainian** Cyrillic as you
type.

- Ukrainian: type `Slava Ukrajini` and get `Слава Україні`
- Belarusian: type `Zhyve Belarus'` and get `Жыве Беларусь`

## What you can do

- Type in one text box and watch the letters change to Cyrillic instantly
- Switch between Беларуская, Українська and Latin (no conversion)
- Check the Letter guide to see which keys give which letters
- Choose a Day, Night or Auto colour theme
- Copy your text with one click

## Tips

- Letters combine as you type: `s` gives с, then adding `h` makes it ш.
- Type `|` to keep two letters apart: `z|h` gives зг instead of ж.
- Use `'` for ь and `` ` `` for the apostrophe ’.

## Privacy

Everything happens in your browser, and nothing is sent anywhere. The app remembers your theme and
language on your device. It remembers your text only if you tick "Save text on reload", and
unticking the box deletes it.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:5173.
