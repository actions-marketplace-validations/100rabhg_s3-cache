# S3 Cache (Local GitHub Action)

A GitHub Action to cache dependencies and artifacts using AWS S3.

## Features

- Restore cache from S3
- Auto upload cache in post step

---

## Inputs

| Name   | Required | Description |
|--------|----------|------------|
| key    | ✅ | Unique cache key |
| path   | ✅ | Path to cache (e.g. node_modules) |
| bucket | ✅ | S3 bucket name |
| region | ❌ | AWS region (if empty, cache is skipped) |

---

## Outputs

| Name      | Description |
|-----------|------------|
| cache-hit | true if cache restored, else false |

---

## Usage

```yaml
- name: Cache node modules
  id: cache
  uses: ./.github/actions/s3-cache
  with:
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    path: node_modules
    bucket: ${{ env.AWS_BUCKET }}
    region: ${{ env.AWS_REGION }}

- name: Install dependencies
  if: steps.cache.outputs.cache-hit != 'true'
  run: npm ci
```
