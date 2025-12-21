export type AssemblyDifficulty = "Beginner" | "Intermediate" | "Advanced";

export interface AssemblyTopic {
  id: string;
  title: string;
  content: string;
  duration: string;
  difficulty: AssemblyDifficulty;
  exercises: number;
}

export interface AssemblyModule {
  id: number;
  title: string;
  description: string;
  topics: AssemblyTopic[];
  duration: string;
  exercises: number;
  completed: boolean;
  codeExample: string;
}

export const assemblyModules: AssemblyModule[] = [
  {
    id: 1,
    title: "Assembly Fundamentals",
    description: "Understand computer architecture and basic assembly language concepts.",
    topics: [
      {
        id: "asm-intro",
        title: "Introduction to Assembly",
        content:
          "Assembly language is the lowest-level human-readable programming language, providing direct control over computer hardware. In this topic you will learn why assembly matters for understanding how computers work, performance optimization, reverse engineering, and embedded systems. You will explore the relationship between assembly and machine code.\n\nBy the end you will understand the role of assembly in the software stack and be motivated to learn this foundational skill.",
        duration: "45 min",
        difficulty: "Beginner",
        exercises: 4
      },
      {
        id: "asm-architecture",
        title: "CPU Architecture Basics",
        content:
          "To write assembly, you must understand CPU architecture. In this topic you will learn about registers (general-purpose, special-purpose), the ALU, memory hierarchy (cache, RAM), and the fetch-decode-execute cycle. We'll focus on x86-64 architecture as a common example.\n\nBy the end you will understand the hardware components your assembly code interacts with.",
        duration: "55 min",
        difficulty: "Beginner",
        exercises: 5
      },
      {
        id: "asm-registers",
        title: "Registers & Data Movement",
        content:
          "Registers are the CPU's fastest storage. In this topic you will learn the x86-64 register set: RAX, RBX, RCX, RDX, RSI, RDI, RSP, RBP, and R8-R15. You will understand register sizes (64-bit, 32-bit, 16-bit, 8-bit) and use MOV instructions to move data between registers and memory.\n\nBy the end you will be comfortable working with registers and basic data movement operations.",
        duration: "60 min",
        difficulty: "Beginner",
        exercises: 6
      },
      {
        id: "asm-addressing",
        title: "Memory Addressing Modes",
        content:
          "Assembly provides various ways to access memory. In this topic you will learn about immediate, register, direct, indirect, and indexed addressing modes. You will understand how to access arrays and structures in memory using effective address calculations.\n\nBy the end you will be able to read and write memory using appropriate addressing modes for different situations.",
        duration: "55 min",
        difficulty: "Intermediate",
        exercises: 6
      }
    ],
    duration: "3.6 hours",
    exercises: 21,
    completed: false,
    codeExample: `; Assembly Fundamentals (x86-64 NASM syntax)
section .data
    message db "Hello, Assembly!", 10, 0
    msg_len equ $ - message

section .bss
    buffer resb 64

section .text
    global _start

_start:
    ; Move data between registers
    mov rax, 42          ; Immediate to register
    mov rbx, rax         ; Register to register
    
    ; Write message to stdout
    mov rax, 1           ; syscall: write
    mov rdi, 1           ; file descriptor: stdout
    mov rsi, message     ; buffer address
    mov rdx, msg_len     ; message length
    syscall
    
    ; Exit program
    mov rax, 60          ; syscall: exit
    xor rdi, rdi         ; exit code 0
    syscall`
  },
  {
    id: 2,
    title: "Arithmetic & Logic Operations",
    description: "Perform calculations and logical operations at the CPU level.",
    topics: [
      {
        id: "asm-arithmetic",
        title: "Arithmetic Instructions",
        content:
          "The CPU performs arithmetic through specific instructions. In this topic you will use ADD, SUB, MUL, IMUL, DIV, and IDIV for integer arithmetic. You will understand the difference between signed and unsigned operations, handle overflow, and work with the FLAGS register.\n\nBy the end you will be able to implement mathematical calculations in assembly.",
        duration: "55 min",
        difficulty: "Intermediate",
        exercises: 6
      },
      {
        id: "asm-logic",
        title: "Logical & Bitwise Operations",
        content:
          "Bitwise operations are fundamental to low-level programming. In this topic you will use AND, OR, XOR, NOT, and shift instructions (SHL, SHR, SAR, ROL, ROR). You will understand bit manipulation techniques for setting, clearing, and testing individual bits.\n\nBy the end you will be comfortable with bitwise operations commonly used in systems programming.",
        duration: "50 min",
        difficulty: "Intermediate",
        exercises: 6
      },
      {
        id: "asm-flags",
        title: "FLAGS Register & Comparisons",
        content:
          "The FLAGS register reflects the results of operations. In this topic you will understand important flags: Zero (ZF), Sign (SF), Carry (CF), Overflow (OF), and Parity (PF). You will use CMP and TEST instructions to set flags without storing results.\n\nBy the end you will understand how the CPU communicates operation results through flags.",
        duration: "50 min",
        difficulty: "Intermediate",
        exercises: 5
      },
      {
        id: "asm-stack",
        title: "The Stack",
        content:
          "The stack is essential for function calls and local variables. In this topic you will understand stack operations with PUSH and POP, the stack pointer (RSP) and base pointer (RBP). You will see how the stack grows downward in memory and manage stack frames.\n\nBy the end you will understand stack-based memory management and its role in program execution.",
        duration: "55 min",
        difficulty: "Intermediate",
        exercises: 6
      }
    ],
    duration: "3.5 hours",
    exercises: 23,
    completed: false,
    codeExample: `; Arithmetic and Logic Operations
section .data
    result_msg db "Result: ", 0

section .text
    global _start

_start:
    ; Arithmetic operations
    mov rax, 100
    mov rbx, 25
    
    add rax, rbx         ; rax = 125
    sub rax, 10          ; rax = 115
    
    ; Multiplication
    mov rax, 7
    mov rbx, 6
    imul rax, rbx        ; rax = 42
    
    ; Division (rdx:rax / rbx)
    mov rax, 100
    xor rdx, rdx         ; Clear rdx for division
    mov rbx, 7
    div rbx              ; rax = quotient, rdx = remainder
    
    ; Bitwise operations
    mov rax, 0xFF00
    mov rbx, 0x0FF0
    and rax, rbx         ; rax = 0x0F00
    
    mov rax, 1
    shl rax, 4           ; rax = 16 (shift left by 4)
    
    ; Stack operations
    push rax
    push rbx
    pop rbx
    pop rax
    
    ; Exit
    mov rax, 60
    xor rdi, rdi
    syscall`
  },
  {
    id: 3,
    title: "Control Flow & Functions",
    description: "Implement branching, loops, and callable functions in assembly.",
    topics: [
      {
        id: "asm-jumps",
        title: "Jumps & Branching",
        content:
          "Control flow in assembly uses jump instructions. In this topic you will use unconditional jumps (JMP) and conditional jumps (JE, JNE, JG, JL, JGE, JLE, etc.). You will implement if-else logic and understand how high-level conditionals translate to assembly.\n\nBy the end you will be able to implement branching logic in assembly programs.",
        duration: "55 min",
        difficulty: "Intermediate",
        exercises: 6
      },
      {
        id: "asm-loops",
        title: "Loops",
        content:
          "Loops are implemented using jumps and counters. In this topic you will implement for loops, while loops, and do-while loops using CMP and conditional jumps. You will also use the LOOP instruction and understand its limitations.\n\nBy the end you will be able to write efficient loops for iterative algorithms.",
        duration: "50 min",
        difficulty: "Intermediate",
        exercises: 6
      },
      {
        id: "asm-functions",
        title: "Functions & Calling Conventions",
        content:
          "Functions in assembly require careful management of registers and the stack. In this topic you will learn the System V AMD64 ABI calling convention: which registers hold arguments (RDI, RSI, RDX, RCX, R8, R9), which are caller/callee-saved, and how return values work.\n\nBy the end you will be able to write functions that can be called from C code.",
        duration: "65 min",
        difficulty: "Advanced",
        exercises: 7
      },
      {
        id: "asm-recursion",
        title: "Recursion & Stack Frames",
        content:
          "Recursion in assembly requires proper stack frame management. In this topic you will implement recursive functions, manage the base pointer for local variables, and understand how each recursive call creates a new stack frame.\n\nBy the end you will understand the mechanics of recursion at the machine level.",
        duration: "55 min",
        difficulty: "Advanced",
        exercises: 5
      }
    ],
    duration: "3.8 hours",
    exercises: 24,
    completed: false,
    codeExample: `; Control Flow and Functions
section .text
    global _start
    global factorial

; Factorial function (recursive)
; Input: rdi = n
; Output: rax = n!
factorial:
    push rbp
    mov rbp, rsp
    push rbx
    
    cmp rdi, 1
    jle .base_case
    
    ; Recursive case: n * factorial(n-1)
    mov rbx, rdi         ; Save n
    dec rdi              ; n - 1
    call factorial       ; factorial(n-1) in rax
    imul rax, rbx        ; n * factorial(n-1)
    jmp .done
    
.base_case:
    mov rax, 1
    
.done:
    pop rbx
    pop rbp
    ret

_start:
    ; Calculate factorial(5)
    mov rdi, 5
    call factorial
    ; Result (120) is in rax
    
    ; Loop example: sum 1 to 10
    xor rax, rax         ; sum = 0
    mov rcx, 10          ; counter
.loop:
    add rax, rcx
    dec rcx
    jnz .loop
    ; Sum (55) is in rax
    
    ; Exit
    mov rax, 60
    xor rdi, rdi
    syscall`
  },
  {
    id: 4,
    title: "System Programming",
    description: "Interface with the operating system and understand low-level concepts.",
    topics: [
      {
        id: "asm-syscalls",
        title: "System Calls",
        content:
          "System calls are how programs request services from the operating system. In this topic you will learn the Linux x86-64 syscall convention, common syscalls (read, write, open, close, exit), and how to use the syscall instruction.\n\nBy the end you will be able to write assembly programs that interact with the OS.",
        duration: "55 min",
        difficulty: "Advanced",
        exercises: 6
      },
      {
        id: "asm-memory",
        title: "Memory Management",
        content:
          "Understanding memory layout is crucial for systems programming. In this topic you will learn about the text, data, BSS, heap, and stack segments. You will use the brk syscall for dynamic memory and understand memory alignment requirements.\n\nBy the end you will understand how programs use memory at the lowest level.",
        duration: "50 min",
        difficulty: "Advanced",
        exercises: 5
      },
      {
        id: "asm-optimization",
        title: "Performance Optimization",
        content:
          "Assembly allows fine-grained performance tuning. In this topic you will learn about instruction latency and throughput, pipeline stalls, branch prediction, and cache-friendly code. You will use SIMD instructions (SSE, AVX) for parallel operations.\n\nBy the end you will understand how to write high-performance assembly code.",
        duration: "60 min",
        difficulty: "Advanced",
        exercises: 6
      },
      {
        id: "asm-debugging",
        title: "Debugging & Tools",
        content:
          "Debugging assembly requires specialized tools. In this topic you will use GDB for assembly debugging, objdump for disassembly, and strace for system call tracing. You will interpret core dumps and understand common bugs.\n\nBy the end you will be equipped to debug and analyze assembly programs effectively.",
        duration: "50 min",
        difficulty: "Intermediate",
        exercises: 5
      }
    ],
    duration: "3.6 hours",
    exercises: 22,
    completed: false,
    codeExample: `; System Programming
section .data
    filename db "output.txt", 0
    content db "Hello from Assembly!", 10
    content_len equ $ - content

section .bss
    fd resq 1
    buffer resb 256

section .text
    global _start

_start:
    ; Open file (create if not exists)
    mov rax, 2           ; syscall: open
    mov rdi, filename    ; filename
    mov rsi, 0x241       ; O_WRONLY | O_CREAT | O_TRUNC
    mov rdx, 0o644       ; permissions
    syscall
    mov [fd], rax        ; save file descriptor
    
    ; Write to file
    mov rax, 1           ; syscall: write
    mov rdi, [fd]        ; file descriptor
    mov rsi, content     ; buffer
    mov rdx, content_len ; length
    syscall
    
    ; Close file
    mov rax, 3           ; syscall: close
    mov rdi, [fd]
    syscall
    
    ; Print success message to stdout
    mov rax, 1
    mov rdi, 1
    mov rsi, content
    mov rdx, content_len
    syscall
    
    ; Exit
    mov rax, 60
    xor rdi, rdi
    syscall`
  }
];




