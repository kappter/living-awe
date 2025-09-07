# Awe Constellation

A living collection of reflections on **awe**, **connection**, and **human creativity**.  
Each entry is a short narrative (2–200 words) stored in `reflections.csv`, and visualized as:

1. **Slideshow** – Navigate reflections one by one with **Previous** and **Next**.
2. **Mindmap** – Explore how concepts connect, with **Awe** at the center.

## Repo Structure
- `index.html` → Entry point
- `style.css` → Styling
- `script.js` → Slideshow + mindmap logic
- `reflections.csv` → Source data (narratives + metadata)
- `/images` → Supporting images

## CSV Format
| id | topic | title | snippet | parent_id | tags | date | image | link | author |

- `id`: unique identifier for the reflection
- `topic`: short label (e.g., "AI", "Connection")
- `title`: descriptive title
- `snippet`: 2–200 word reflection
- `parent_id`: link to another row for hierarchical concepts
- `tags`: keywords
- `date`: YYYY-MM-DD
- `image`: path to optional image in `/images`
- `link`: external reference
- `author`: optional contributor name

## Contributing
- Add new reflections to `reflections.csv`
- Place any supporting images in `/images`
- Open PRs or issues to expand features
