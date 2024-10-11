// src/utils/models.ts

// Cloudflare
// https://developers.cloudflare.com/workers-ai/models/

const MODELS = [
  {
    id: '@cf/openai/whisper-tiny-en',
    name: 'whisper-tiny-en',
    provider: 'cloudflare',
    type: 'auido'
  },
  {
    id: '@cf/openai/whisper',
    name: 'whisper',
    provider: 'cloudflare',
    type: 'auido'
  },
  {
    id: '@cf/microsoft/resnet-50',
    name: 'resnet-50',
    provider: 'cloudflare',
    type: 'image-classification'
  },
  {
    id: '@cf/meta/m2m100-1.2b',
    name: 'm2m100-1.2b',
    provider: 'cloudflare',
    type: 'translation'
  },
  {
    id: '@cf/llava-hf/llava-1.5-7b-hf',
    name: 'llava-1.5-7b-hf',
    provider: 'cloudflare',
    type: 'image-to-text'
  },
  {
    id: '@cf/unum/uform-gen2-qwen-500m',
    name: 'uform-gen2-qwen-500m',
    provider: 'cloudflare',
    type: 'image-to-text'
  },
  {
    id: '@cf/lykon/dreamshaper-8-lcm',
    name: 'dreamshaper-8-lcm',
    provider: 'cloudflare',
    type: 'text-to-image'
  },
  {
    id: '@cf/runwayml/stable-diffusion-v1-5-img2img',
    name: 'stable-diffusion-v1-5-img2img',
    provider: 'cloudflare',
    type: 'text-to-image'
  },
  {
    id: '@cf/runwayml/stable-diffusion-v1-5-inpainting',
    name: 'stable-diffusion-v1-5-inpainting',
    provider: 'cloudflare',
    type: 'text-to-image'
  },
  {
    id: '@cf/stabilityai/stable-diffusion-xl-base-1.0',
    name: 'stable-diffusion-xl-base-1.0',
    provider: 'cloudflare',
    type: 'text-to-image'
  },
  {
    id: '@cf/bytedance/stable-diffusion-xl-lightning',
    name: 'stable-diffusion-xl-lightning',
    provider: 'cloudflare',
    type: 'text-to-image'
  },
  {
    id: '@cf/huggingface/distilbert-sst-2-int8',
    name: 'distilbert-sst-2-int8',
    provider: 'cloudflare',
    type: 'text-classification'
  },
  {
    id: '@cf/facebook/detr-resnet-50',
    name: 'detr-resnet-50',
    provider: 'cloudflare',
    type: 'object-detection'
  },
  {
    id: "@hf/thebloke/deepseek-coder-6.7b-base-awq",
    name: "deepseek-coder-6.7b-base-awq",
    provider: 'cloudflare',
    type: 'chat'
  },
  {
    id: '@hf/thebloke/deepseek-coder-6.7b-instruct-awq',
    name: 'deepseek-coder-6.7b-instruct-awq',
    provider: 'cloudflare',
    type: 'chat'
  },
  {
    id: '@cf/deepseek-ai/deepseek-math-7b-base',
    name: 'deepseek-math-7b-base',
    provider: 'cloudflare',
    type: 'chat'
  },
  {
    id: '@cf/deepseek-ai/deepseek-math-7b-instruct',
    name: 'deepseek-math-7b-instruct',
    provider: 'cloudflare',
    type: 'chat'
  },
  {
    id: '@cf/thebloke/discolm-german-7b-v1-awq',
    name: 'discolm-german-7b-v1-awq',
    provider: 'cloudflare',
    type: 'chat'
  },
  {
    id: '@cf/tiiuae/falcon-7b-instruct',
    name: 'falcon-7b-instruct',
    provider: 'cloudflare',
    type: 'chat'
  },
  {
    id: '@cf/google/gemma-2b-it-lora',
    name: 'gemma-2b-it-lora',
    provider: 'cloudflare',
    type: 'chat'
  },
  {
    id: '@cf/google/gemma-7b-it-lora',
    name: 'gemma-7b-it-lora',
    provider: 'cloudflare',
    type: 'chat'
  },
  {
    id: '@hf/google/gemma-7b-it',
    name: 'gemma-7b-it',
    provider: 'cloudflare',
    type: 'chat'
  },
  {
    id: '@hf/nousresearch/hermes-2-pro-mistral-7b',
    name: 'hermes-2-pro-mistral-7b',
    provider: 'cloudflare',
    type: 'chat'
  },
  {
    id: '@hf/thebloke/llama-2-13b-chat-awq',
    name: 'llama-2-13b-chat-awq',
    provider: 'cloudflare',
    type: 'chat'
  },
  {
    id: '@cf/meta/llama-2-7b-chat-fp16',
    name: 'llama-2-7b-chat-fp16',
    provider: 'cloudflare',
    type: 'chat'
  },
  {
    id: '@cf/meta-llama/llama-2-7b-chat-hf-lora',
    name: 'llama-2-7b-chat-hf-lora',
    provider: 'cloudflare',
    type: 'chat'
  },
  {
    id: '@cf/meta/llama-3-8b-instruct-awq',
    name: 'llama-3-8b-instruct-awq',
    provider: 'cloudflare',
    type: 'chat'
  },
  {
    id: '@cf/meta/llama-3.1-8b-instruct-awq',
    name: 'llama-3.1-8b-instruct-awq',
    provider: 'cloudflare',
    type: 'chat'
  },
  {
    id: '@cf/meta/llama-3.1-8b-instruct-fp8',
    name: 'llama-3.1-8b-instruct-fp8',
    provider: 'cloudflare',
    type: 'chat'
  },
  {
    id: '@cf/meta/llama-3.1-8b-instruct',
    name: 'llama-3.1-8b-instruct',
    provider: 'cloudflare',
    type: 'chat'
  },
  {
    id: '@hf/thebloke/llamaguard-7b-awq',
    name: 'llamaguard-7b-awq',
    provider: 'cloudflare',
    type: 'chat'
  },
  {
    id: '@hf/thebloke/mistral-7b-instruct-v0.1-awq',
    name: 'mistral-7b-instruct-v0.1-awq',
    provider: 'cloudflare',
    type: 'chat'
  },
  {
    id: '@cf/mistral/mistral-7b-instruct-v0.1',
    name: 'mistral-7b-instruct-v0.1',
    provider: 'cloudflare',
    type: 'chat'
  },
  {
    id: '@cf/mistral/mistral-7b-instruct-v0.2-lora',
    name: 'mistral-7b-instruct-v0.2-lora',
    provider: 'cloudflare',
    type: 'chat'
  },
  {
    id: '@hf/mistral/mistral-7b-instruct-v0.2',
    name: 'mistral-7b-instruct-v0.2',
    provider: 'cloudflare',
    type: 'chat'
  },
  {
    id: '@hf/thebloke/neural-chat-7b-v3-1-awq',
    name: 'neural-chat-7b-v3-1-awq',
    provider: 'cloudflare',
    type: 'chat'
  },
  {
    id: '@cf/openchat/openchat-3.5-0106',
    name: 'openchat-3.5-0106',
    provider: 'cloudflare',
    type: 'chat'
  },
  {
    id: '@hf/thebloke/openhermes-2.5-mistral-7b-awq',
    name: 'openhermes-2.5-mistral-7b-awq',
    provider: 'cloudflare',
    type: 'chat'
  },
  {
    id: '@cf/microsoft/phi-2',
    name: 'phi-2',
    provider: 'cloudflare',
    type: 'chat'
  },
  {
    id: '@cf/qwen/qwen1.5-0.5b-chat',
    name: 'qwen1.5-0.5b-chat',
    provider: 'cloudflare',
    type: 'chat'
  },
  {
    id: '@cf/qwen/qwen1.5-1.8b-chat',
    name: 'qwen1.5-1.8b-chat',
    provider: 'cloudflare',
    type: 'chat'
  },
  {
    id: '@cf/qwen/qwen1.5-14b-chat-awq',
    name: 'qwen1.5-14b-chat-awq',
    provider: 'cloudflare',
    type: 'chat'
  },
  {
    id: '@cf/qwen/qwen1.5-7b-chat-awq',
    name: 'qwen1.5-7b-chat-awq',
    provider: 'cloudflare',
    type: 'chat'
  },
  {
    id: '@cf/defog/sqlcoder-7b-2',
    name: 'sqlcoder-7b-2',
    provider: 'cloudflare',
    type: 'chat'
  },
  {
    id: '@hf/nexusflow/starling-lm-7b-beta',
    name: 'starling-lm-7b-beta',
    provider: 'cloudflare',
    type: 'chat'
  },
  {
    id: '@cf/tinyllama/tinyllama-1.1b-chat-v1.0',
    name: 'tinyllama-1.1b-chat-v1.0',
    provider: 'cloudflare',
    type: 'chat'
  },
  {
    id: '@cf/fblgit/una-cybertron-7b-v2-bf16',
    name: 'una-cybertron-7b-v2-bf16',
    provider: 'cloudflare',
    type: 'chat'
  },
  {
    id: '@cf/fblgit/una-cybertron-7b-v2-bf16',
    name: 'una-cybertron-7b-v2-bf16',
    provider: 'cloudflare',
    type: 'chat'
  },
  {
    id: '@hf/thebloke/zephyr-7b-beta-awq',
    name: 'zephyr-7b-beta-awq',
    provider: 'cloudflare',
    type: 'chat'
  },
  {
    id: '@cf/baai/bge-base-en-v1.5',
    name: 'bge-base-en-v1.5',
    provider: 'cloudflare',
    type: 'embedding'
  },
  {
    id: '@cf/baai/bge-large-en-v1.5',
    name: 'bge-large-en-v1.5',
    provider: 'cloudflare',
    type: 'embedding'
  },
  {
    id: '@cf/baai/bge-small-en-v1.5',
    name: 'bge-small-en-v1.5',
    provider: 'cloudflare',
    type: 'embedding'
  },
  {
    id: '@cf/facebook/bart-large-cnn',
    name: 'bart-large-cnn',
    provider: 'cloudflare',
    type: 'summary'
  },
];

export { MODELS };